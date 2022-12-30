export const GOOGLE_MAP_API_KEY =
  process.env.REACT_APP_GOOGLE_MAP_API_KEY ?? 'AIzaSyAVSqzLO91vvXvrJzb9l0dfradiAWccIYo';

class GoogleMapsService {
    readonly url: string;
    private loadAPI!: any;

    constructor() {
        this.url = `https://maps.googleapis.com/maps/api/js?libraries=places&&callback=__googleMapLoaded&key=${GOOGLE_MAP_API_KEY}`;
    }

    private loadScript(): void {
        if (!document.getElementById('google-maps-container')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `${this.url}`;
            script.id = 'google-maps-container';
            document.head.appendChild(script);
        }
    }

    init(): any {
        if (!this.loadAPI) {
            this.loadAPI = new Promise((resolve, reject) => {
               
                (window as { [key: string]: any }).__googleMapLoaded = () => {
                    resolve((window as { [key: string]: any }).google.maps);
                };
                if ((window as { [key: string]: any }).google !== undefined && typeof (window as { [key: string]: any }).google.maps === 'object') {
                    resolve((window as { [key: string]: any }).google.maps);
                }
                this.loadScript();
            });
        }
        return this.loadAPI;
    }
}

const GooogleMapServiceObject = new GoogleMapsService();

const GoogleMapsObject = {
    googleMapInit: () => {
        return GooogleMapServiceObject.init();
    }
}

export default GoogleMapsObject;