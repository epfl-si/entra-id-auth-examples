name := "scala-msal4j-auth"

version := "0.1"

scalaVersion := "2.13.14"

val http4sVersion = "0.23.24"
val circeVersion = "0.14.7"
val jwtVersion = "9.0.5"

libraryDependencies ++= Seq(
  "com.microsoft.azure" % "msal4j" % "1.21.0",
  "org.http4s" %% "http4s-dsl" % http4sVersion,
  "org.http4s" %% "http4s-ember-server" % http4sVersion,
  "org.http4s" %% "http4s-ember-client" % http4sVersion,
  "org.http4s" %% "http4s-circe" % http4sVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "com.github.jwt-scala" %% "jwt-core" % jwtVersion,
  "com.github.jwt-scala" %% "jwt-circe" % jwtVersion,
  "org.slf4j" % "slf4j-simple" % "2.0.12",
)