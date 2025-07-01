package authdemo.auth

import com.microsoft.aad.msal4j._
import java.net.URI
import java.util.Base64
import scala.jdk.CollectionConverters._
import io.circe._
import io.circe.parser._
import org.http4s.ResponseCookie
import scala.concurrent.duration._
import java.time.Instant
import cats.data.{Kleisli, OptionT}
import cats.effect._
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.server.AuthMiddleware
import org.http4s.headers.Location
import org.http4s.implicits._

object Authenticator {

  private val clientId     = sys.env.getOrElse("OPENID_CLIENT_ID", throw new RuntimeException("Missing OPENID_CLIENT_ID")).trim
  private val clientSecret = sys.env.getOrElse("OPENID_CLIENT_SECRET", throw new RuntimeException("Missing OPENID_CLIENT_SECRET")).trim
  private val scopes       = sys.env.getOrElse("OPENID_CLIENT_SCOPE", throw new RuntimeException("Missing OPENID_CLIENT_SCOPE")).split(" ").toSet.asJava
  private val tenantId     = sys.env.getOrElse("OPENID_TENANT_ID", throw new RuntimeException("Missing OPENID_TENANT_ID")).trim
  private val redirectUri  = sys.env.getOrElse("OPENID_REDIRECT_URI", throw new RuntimeException("Missing OPENID_REDIRECT_URI")).trim

  private val authority = s"https://login.microsoftonline.com/$tenantId"
  private val expectedIssuer = s"https://login.microsoftonline.com/$tenantId/v2.0"
  private val jwtCookieName = "idToken"

  object CodeQueryParamMatcher extends QueryParamDecoderMatcher[String]("code")

  private val confidentialClient: ConfidentialClientApplication =
    ConfidentialClientApplication.builder(clientId, ClientCredentialFactory.createFromSecret(clientSecret))
      .authority(authority)
      .build()

  def getAuthorizationRequestUrl(): String = {
    val params = AuthorizationRequestUrlParameters.builder(redirectUri, scopes)
      .responseMode(ResponseMode.QUERY)
      .prompt(Prompt.SELECT_ACCOUNT)
      .build()

    confidentialClient.getAuthorizationRequestUrl(params).toString
  }

  def getAuthToken(authCode: String): IAuthenticationResult = {
    val params = AuthorizationCodeParameters.builder(authCode, new URI(redirectUri))
      .scopes(scopes)
      .build()

    confidentialClient.acquireToken(params).get()
  }

  private def validateClaims(claims: Map[String, String]): Unit = {
    val aud = claims.get("aud").getOrElse(throw new RuntimeException("Missing 'aud' in token"))
    val iss = claims.get("iss").getOrElse(throw new RuntimeException("Missing 'iss' in token"))
    val exp = claims.get("exp").flatMap(s => scala.util.Try(s.toLong).toOption)
      .getOrElse(throw new RuntimeException("Missing or invalid 'exp' in token"))

    if (aud != clientId)
      throw new RuntimeException(s"Invalid audience: $aud")

    if (!iss.startsWith(expectedIssuer))
      throw new RuntimeException(s"Invalid issuer: $iss")

    val now = Instant.now().getEpochSecond
    if (exp < now)
      throw new RuntimeException("Token has expired")
  }

  def extractClaims(idToken: String): Map[String, String] = {
    val parts = idToken.split('.')
    if (parts.length != 3)
      throw new IllegalArgumentException("Invalid JWT token")

    val payloadJson = new String(Base64.getUrlDecoder.decode(parts(1)))
    parse(payloadJson) match {
      case Left(err) => throw new RuntimeException(s"Failed to parse ID token claims: $err")
      case Right(json) =>
        val claims = json.asObject.map(_.toMap.view.mapValues(_.toString().replaceAll("\"", "")).toMap).getOrElse(Map.empty)

        validateClaims(claims)
        claims
    }
  }

  def getUserIdentifierFromClaims(claims: Map[String, String]): Option[String] = {
    claims.get("preferred_username")
      .orElse(claims.get("email"))
  }

  def connect(idToken: String, req: Request[IO], resp: Response[IO]): Response[IO] = {
    val claims             = extractClaims(idToken)
    val tokenExpirySeconds = claims.get("exp").flatMap(s => scala.util.Try(s.toLong).toOption)
      .getOrElse(throw new RuntimeException("Missing 'exp' in token claims"))

    val expirySeconds = tokenExpirySeconds - Instant.now().getEpochSecond
    val isSecure      = req.uri.scheme.contains(Uri.Scheme.https)

    resp.addCookie(ResponseCookie(
      name     = jwtCookieName,
      content  = idToken,
      path     = Some("/"),
      httpOnly = true,
      secure   = isSecure,
      maxAge   = Some(expirySeconds)
    ))
  }

  def diconnect(resp: Response[IO]): Response[IO] = {
    resp.removeCookie(jwtCookieName)
  }

  def sessionMiddleware: AuthMiddleware[IO, String] = {
    val authUser: Kleisli[IO, Request[IO], Either[Unit, String]] = Kleisli { req =>
      req.cookies.find(_.name == jwtCookieName) match {
        case Some(cookie) =>
          val claims = extractClaims(cookie.content)
          getUserIdentifierFromClaims(claims) match {
            case Some(user) => IO.pure(Right(user))
            case None        => IO.pure(Left(()))
          }
        case None => IO.pure(Left(()))
      }
    }

    val onAuthFailure: AuthedRoutes[Unit, IO] = Kleisli { _ =>
      OptionT.liftF(Found(Location(uri"/login")))
    }

    AuthMiddleware(authUser, onAuthFailure)
  }
}