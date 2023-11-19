import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    count: number = 0;

    constructor() {
    }

    addLoading(){
        this.count++;
    }

    decreaseLoading(){
        this.count--;
    }

}
