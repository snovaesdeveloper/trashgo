import {latLng, Layer, MapOptions, marker, Marker, tileLayer} from "leaflet";
import {LeafletControlLayersConfig} from "@asymmetrik/ngx-leaflet";
import {Injectable, OnDestroy} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export default class LeafletService {

    options : MapOptions = {
        layers: [
            tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
                minZoom: 0,
                maxZoom: 20,
                attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            })
        ],
        zoom: 6,
        center: latLng(-1.45502, -48.5024),
    };
    layers: Layer[] = [];
    layersControl: LeafletControlLayersConfig = {
        overlays: {},
        baseLayers: {
            'Stadia Outdoors': tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
                minZoom: 0,
                maxZoom: 20,
                attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }),
            'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '...'
            }),
        }
    };

    addLayer(marker: Marker){
        this.layers.push(marker);
    }

    removeAllLayers(){
        this.layers = [];
    }

}
