(function(){

	const geo = {

		/* Adding and clearing position marker */

        clearMarker: function(){
            this.map.removeLayer(this.marker);
        },

		addMarker: function(pos){

            this.clearMarker();

            this.marker = new ol.layer.Vector({
             source: new ol.source.Vector({
                 features: [
                     new ol.Feature({
                         geometry: new ol.geom.Point(ol.proj.fromLonLat([pos[0], pos[1]]))
                     })
                 ]
             }),
             style: new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
              })
            })
            });

            this.map.setView(new ol.View({
                center: ol.proj.fromLonLat([pos[0], pos[1]]),
                zoom: 10
            }));

            this.map.addLayer(this.marker);

        },

		/* User position geocoding */

        getCoord: function(){
              this.data = {
                    "format": "json",
                    "addressdetails": 1,
                    "q": this.from,
                    "limit": 1
              };
              return new Promise((resolve, reject) => {
                    $.ajax({
                      method: "GET",
                      url: "https://nominatim.openstreetmap.org",
                      data: this.data,
                      success: function(msg) {
                        resolve(msg)
                      },
                      error: function(error) {
                        reject(error)
                      }
                    });
              });
        },

		/* User position geolocation */

        getUserPosition: function(){

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.addMarker([Number(position.coords.longitude), Number(position.coords.latitude)]);
                },
                function(error){
                    console.log("Błąd");
                },
                {
                    enableHighAccuracy: true
                }
          );

        },

		isGeoLocationSupported: function(){

            if(navigator.geolocation){

                this.find.hidden = false;

                this.find.onclick = (e) => {
                    this.getUserPosition();
                };
            }

        },

		init: function(options){

			this.options = options;
            this.showForm = document.querySelector("form");
            this.fromInput = this.showForm.querySelector("input");
            this.find = document.querySelector("#find");

			/* Map configuration */

            this.config = {
                layers: [
                 new ol.layer.Tile({
                     source: new ol.source.OSM()
                 })
                ],
                target: this.options.target,
                view: new ol.View({
                     center: ol.proj.fromLonLat(this.options.location),
                     zoom: this.options.zoom
                })
            };

			/* Map creating */

            try{
                this.map = new ol.Map(this.config);
            }
            catch(e){
                return;
            }

			/* User position geocoding */

            this.showForm.onsubmit = (e) => {

                e.preventDefault();
                this.from = this.fromInput.value;
                this.getCoord()
                    .then(data => {
                        this.data = data;
                        this.addMarker([Number(this.data[0].lon), Number(this.data[0].lat)]);
                        this.fromInput.value = "";
                    })
                    .catch(error => {
                        console.log(error)
                    });

            };

			/* User position geolocation*/

            this.isGeoLocationSupported();

		}
	};

	geo.init({
		location: [0, 51.476852],
       	target: "map",
       	zoom: 4
	});


})();
