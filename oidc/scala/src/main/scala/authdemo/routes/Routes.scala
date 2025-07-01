package authdemo.routes

import cats.data.{Kleisli, OptionT}
import cats.effect._
import cats.syntax.all._
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.implicits._
import org.http4s.headers.{Location, `Content-Type`}
import org.http4s.MediaType
import org.http4s.dsl.impl.QueryParamDecoderMatcher
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.middleware.Logger
import org.http4s.server.{AuthMiddleware, Router}
import com.comcast.ip4s._
import authdemo.auth.Authenticator
import authdemo.auth.Authenticator.CodeQueryParamMatcher

object Routes {

  private val authedRoutes: AuthedRoutes[String, IO] = AuthedRoutes.of {
    case GET -> Root as user =>
      Ok(
        s"""
           |<html>
           |<head><title>Welcome</title></head>
           |<body>
           |  <h1>Welcome, $user!</h1>
           |  <form method="POST" action="/logout">
           |    <button type="submit">Disconnect</button>
           |  </form>
           |</body>
           |</html>
           |""".stripMargin
      ).map(_.withContentType(`Content-Type`(MediaType.text.html)))
  }

  private val baseRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case GET -> Root / "login" =>
      IO(Authenticator.getAuthorizationRequestUrl()).flatMap { url =>
        PermanentRedirect(Location(Uri.unsafeFromString(url.trim)))
      }

    case req @ GET -> Root / "redirect" :? CodeQueryParamMatcher(code) =>
      IO.blocking(Authenticator.getAuthToken(code)).flatMap { authResult =>
        val resp = SeeOther(Location(uri"/"))
        resp.map(r => Authenticator.connect(authResult.idToken(), req, r))
      }

    case req @ POST -> Root / "logout" =>
      SeeOther(Location(uri"/")).map(r => Authenticator.diconnect(r))
  }

  private val allRoutes: HttpRoutes[IO] =
    baseRoutes <+> Authenticator.sessionMiddleware(authedRoutes)

  private val httpAppWithLogging: HttpApp[IO] =
    Logger.httpApp(true, true)(Router("/" -> allRoutes).orNotFound)

  val server: Resource[IO, Unit] =
    EmberServerBuilder.default[IO]
      .withHost(Host.fromString("0.0.0.0").get)
      .withPort(Port.fromInt(8080).get)
      .withHttpApp(httpAppWithLogging)
      .build
      .void
}
