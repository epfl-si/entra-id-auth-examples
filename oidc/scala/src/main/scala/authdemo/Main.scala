package authdemo

import cats.effect._
import authdemo.routes.Routes

object Main extends IOApp {
  def run(args: List[String]): IO[ExitCode] =
    Routes.server.use(_ => IO.never).as(ExitCode.Success)
}