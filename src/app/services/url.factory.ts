import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class URLFactory {
    createUrl(route: string) {
        if (!route.startsWith(`/`)) {
            route = `/${route}`;
        }
        return `${environment.apiUrl}${route}`;
    }
}
