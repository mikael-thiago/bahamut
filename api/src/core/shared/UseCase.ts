export abstract class UseCase<Request, Response, Errors = unknown> {
  abstract execute(request: Request): Promise<unknown extends Errors ? Response : Response | Errors>;
}
