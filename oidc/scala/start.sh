export $(grep -v '^#' .env | xargs)
sbt run
