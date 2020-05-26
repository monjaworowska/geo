(function(){

	const geo = {


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

		}
	};

	geo.init({
		location: [0, 51.476852],
       	target: "map",
       	zoom: 4
	});


})();
