import { Catch, ArgumentsHost, WsExceptionFilter, ForbiddenException, UnauthorizedException, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException, ForbiddenException, UnauthorizedException)
export class WsExceptionLoggerFilter implements WsExceptionFilter {
    private readonly logger = new Logger(WsExceptionLoggerFilter.name);

    catch(exception: WsException | ForbiddenException | UnauthorizedException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        const context = host.switchToWs();
        const data = context.getData();

        let errorMessage: string;
        if (exception instanceof WsException || exception instanceof ForbiddenException || exception instanceof UnauthorizedException) {
            errorMessage = exception.message;
        } else {
            errorMessage = 'Unknown error occurred';
        }

        this.logger.error(`Via Socket | Error: ${errorMessage} - Data: ${JSON.stringify(data)} - Client ID: ${client.id}`);
        client.emit('error', { message: errorMessage });
    }
}
