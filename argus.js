function InteractiveTrainer(workarea) {
	this.workarea = $(workarea);
	this.all_divs = [];
	this.is_selected_element = -1;
/*
	this.workarea.html(
'		<div class="col-md-8">'+
'			<div style="margin:1em">'+
'				<img id="target" class="img-responsive">'+
'			</div>'+
'		</div>'+
'		<div class="col-md-4">'+
'			<div style="margin:1em">'+
'				<input id="updatebtn" type="button" class="btn" value="Update">'+
'			</div>'+
'		</div>'
	);
*/
	this.jcrop_api = null;
	

}

InteractiveTrainer.prototype = {

		show_image: function(labels) {
	
			console.log(labels);
//			var img = $('img', this.workarea);
//			img.attr('src', 'image.jpg');
			console.log(typeof(labels));

			for (i = 0; i < labels.length; i++) {
			//for (var label in JSON.parse(labels)) {
				var _x = labels[i][1][0];
				var _y = labels[i][1][1]; 
				var _w = labels[i][1][2];
				var _h = labels[i][1][3];
		
				var $div = $('<div />').width(_w).height(_h).css({
					position: 'absolute',
					zIndex: 2000,
					top: _x,
					left: _y,
					border: "2px solid black"
							
				});
			
				$div.attr("id", i);

/*
				jQuery(function($) {
				$('.jc').Jcrop({
 		 		}, function() {
					jcrop_api1 = this;
					});
				});
*/
				var selfObj = this;
/*
				$div.mouseover().css({
						cursor: 'move'
				});
*/				

				//var is_selected_element = this.is_selected_element;
				$div.mousedown(

					function(e){
						selfObj.is_selected_element = parseInt($(this).attr('id'));
						$(this).hide();
						var x1 = $(this).css('left');
						x1 = parseInt(x1.substring(0,3))
						var y1 = $(this).css('top');
					y1 = parseInt(y1.substring(0,3));
					var width = $(this).width()
					var height = $(this).height();
				
					var x2 = x1 + width;
					var y2 = y1 + height;
				
					selfObj.jcrop_api.setSelect([x1,y1,x2,y2]);
					return false;
				}
	
				);

				var $img = $('.jcrop-holder');
			
				$img.append($div).css({
					position : 'absolute'
		    		});
				this.all_divs.push($div);
			}

	
		},

		learn_features: function() {
			console.log('learn_features');
			// call $.ajax POST on api.php with op "learn_features"
		},

		identify_objects: function(frm) {
			console.log('identify_objects');
			console.log(frm);
			
			var form = document.getElementById('file-form');
			var fileSelect = document.getElementById('file-select');
			var uploadButton = document.getElementById('upload-button');
			var files = fileSelect.files;
			var formData = new FormData();
			var file = files[0];
			var labels = [];
			formData.append('test_image', file, file.name);

			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'api.php?op=identify_objects', false);

			xhr.onload = function () {
				if (xhr.status === 200) {
					response = JSON.parse(xhr.responseText);
					//var _id = response._id;
					//var label1 = response.labels.label1._id;
		    			// File(s) uploaded.
					uploadButton.innerHTML = 'Upload';
				} else {
					alert('An error occurred!');
				}
			};

			xhr.send(formData);	
			

			
			var _id = response._id;
			var _labels = response.labels;
			for (i=0; i<_labels.length; i++) {
				var label_id = _labels[i]._id;
				var box = _labels[i].box[0].concat(_labels[i].box[1]);
				//item["label_id"] = label_id;
				//item["box"] = box;
				labels.push([label_id, box]);
			}
			
		
			// send image to api.php using $.ajax POST request with op "identify_objects"
			//var labels = { _id: "1", labels: [] }; // get labels from ajax result
			this.activate_jcrop();
			this.show_image(labels);
			
/*
			for (i=0; i<labels.length; i++) {
				var x1 = labels[i][1][0];
				var y1 = labels[i][1][1]; 
				var width = labels[i][1][2];
				var height = labels[i][1][3];
		
				
					var x2 = x1 + width;
					var y2 = y1 + height;
				
					jcrop_api.setSelect([x1,y1,x2,y2]);
					return false;
			}
*/
			
			

		},

		
		activate_jcrop: function() {
			var self_obj = this;

			jQuery(function($) {
				$('#target').Jcrop({
 		 		}, function() {
					self_obj.jcrop_api = this;
				});
			});
		}

};

function start() {
	
	it = new InteractiveTrainer($('#workarea'));
	$('#upload-button').click(function(e) {
		e.preventDefault();
		it.identify_objects(this);
	});
	$('#crop').click(function(e) {
		console.log(it.is_selected_element);
		//for(j=0; j<it.all_divs.length; j++) {
			if (it.is_selected_element >= 0) {
			
				new_coordinates = it.jcrop_api.tellSelect();
				new_h = new_coordinates.h;
				new_w = new_coordinates.w;
				new_x1 = new_coordinates.x;
				new_x2 = new_coordinates.x2
				new_y1 = new_coordinates.y;
				new_y2 = new_coordinates.y2;
				it.all_divs[it.is_selected_element].width(new_w).height(new_h).css({
					top: new_x1,
					left: new_y1
				})
				it.all_divs[it.is_selected_element].show()
				it.is_selected_element = -1
				it.jcrop_api.release();
				return false;

			}
			else {
				new_coordinates = it.jcrop_api.tellSelect();
				_h = new_coordinates.h;
				_w = new_coordinates.w;
				_x = new_coordinates.x;
				_x2 = new_coordinates.x2
				_y = new_coordinates.y;
				_y2 = new_coordinates.y2;
			
				
		
				var $div = $('<div />').width(_w).height(_h).css({
					position: 'absolute',
					zIndex: 2000,
					left: _x,
					top: _y,
					border: "2px solid black"
							
				});
			
				$div.attr("id", it.all_divs.length+1);


				var selfObj = this;
/*
				$div.mouseover().css({
						cursor: 'move'
				});
*/				

				//var is_selected_element = this.is_selected_element;
				$div.mousedown(

					function(e){
						selfObj.is_selected_element = parseInt($(this).attr('id'));
						$(this).hide();
						var x1 = $(this).css('left');
						x1 = parseInt(x1.substring(0,3))
						var y1 = $(this).css('top');
					y1 = parseInt(y1.substring(0,3));
					var width = $(this).width()
					var height = $(this).height();
				
					var x2 = x1 + width;
					var y2 = y1 + height;
				
					selfObj.jcrop_api.setSelect([x1,y1,x2,y2]);
					return false;
				}
	
				);

				var $img = $('.jcrop-holder');
			
				$img.append($div).css({
					position : 'absolute'
		    		});
				it.all_divs.push($div);
				it.jcrop_api.release();
				return false;
			}	
		//}
	})

	$('#updatebtn').on('click', this.learn_features);
}

function previewFile() {
  	var preview = document.querySelector('img');
  	var file    = document.querySelector('input[type=file]').files[0];
  	var reader  = new FileReader();
	
	reader.onloadend = function () {
		preview.src = reader.result;
	}

	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}

$(document).ready(start);
