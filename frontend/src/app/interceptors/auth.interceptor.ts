import { HttpInterceptorFn} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Clonar la peticion para anadir globalmente la opcion de incluir cookies 
    const clonedRequest = req.clone({
        withCredentials: true
    })
    return next(clonedRequest);
}

