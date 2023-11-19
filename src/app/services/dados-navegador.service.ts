import {Inject, Injectable, InjectionToken} from "@angular/core";

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE', {
    providedIn: 'root',
    factory: () => localStorage
});

@Injectable({
    providedIn: 'root'
})
export class DadosNavegador {

    constructor(@Inject(LOCAL_STORAGE) public storage: Storage) {}

    get(key: string) {
        return this.storage.getItem(key);
    }

    set(key: string, value: string) {
        this.storage.setItem(key, value);
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

}
