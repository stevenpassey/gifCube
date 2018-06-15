var toolTips = {"preset-1": "The IT Crowd"};

var cubeAttached = false;
var $attachedCube;
var $attachedCubeFront;
var attachedLocationX = 0;
var attachedLocationY = 0;
var attachedLocationX_delta = 0;
var attachedLocationX_delta = 0;

window.onload = function () {
	
	setTimeout(function () { $(".logo-line-45").css({transform: "rotate(-45deg) translateY(-50px)", animation: "none"}); }, 2850);
	setTimeout(function () { $(".logo-line-45").css({animation: "lineWait 1s infinite alternate forwards"}); setLine();}, 2900);

	window.onmousemove = function(e) {
		attachedLocationX = e.pageX;
    		attachedLocationY = e.pageY;
	};
}

function setLine()
{
	$(".logo-line-45").on("mouseleave", function (e) { 
	
		$(".logo-line-45").off();
		setTimeout(function () { $(".logo-line-45").css({transform: "rotate(-45deg) translateY(-50px)", animation: "none"}); }, 50);
		setTimeout(function () { $(".logo-line-45").css({animation: "lineLeave 1s forwards"}); 
						 $(".logo-gif").css({opacity: "0"});
						 $(".logo-line").css({opacity: "0"});
						 $(".logo-cube").css({opacity: "0"});
		}, 100);

		/*front,back,left,right,top,bottom*/

		setTimeout(function () {
			$('body').append( '<div class="cube-drawer"></div>' +
						'<div class="mainDiv">' +
					     		'<div id="preset-1" class="boxDiv" draggable="false">' +
								 '<div class="side-1" draggable="false">' + 
									'<img src="http://i.giphy.com/media/XzYY9fZM6sNFe/giphy_s.gif">' +
								 '</div>' +
								 '<div class="side-2" draggable="false">' +
									'<img src="http://i.giphy.com/media/ghutdpgRkhkxq/giphy_s.gif">' +
								 '</div>' +
								 '<div class="side-3" draggable="false">' +
									'<img src="http://i.giphy.com/media/Di2mwQYkluqA0/giphy_s.gif">' +
								 '</div>' +
								 '<div class="side-4" draggable="false">' +
									'<img src="http://i.giphy.com/media/c6DIpCp1922KQ/giphy_s.gif">' +
								 '</div>' +
								 '<div class="side-5" draggable="false">' +
									'<img src="http://i.giphy.com/media/x6FyODo9mHhOU/giphy_s.gif" style="transform: scale(1, -1);">' +
								 '</div>' +
								 '<div class="side-6" draggable="false">' +
									'<img src="http://i.giphy.com/media/dfAedgq9nlPxe/giphy_s.gif" style="transform: scale(1, -1);">' +
								 '</div>' +
							 '</div>' +
						 '</div>');


		}, 600);

		setTimeout( function () {

			$("#preset-1 .side-1").on("mouseenter", function () { brightenBackground(this, false); showToolTip(this.parentElement.id, false); playTopGif(this.firstChild, false); });
			$("#preset-1 .side-1").on("mouseleave", function () { brightenBackground(this, true); showToolTip(this.parentElement.id, true); playTopGif(this.firstChild, true); });
			$("#preset-1 .side-1").on("click", function (event) { attachCube(event, this, this.parentElement.parentElement) });
		}, 1600);
	});
}

function brightenBackground(e, revert)
{
	if($(e).offset().left < 3) //When you turn this event back on with jquery it fires for some reason
	{
		var currentColor = $(e).css("backgroundColor"); 			//gets the current background color definition of the element
	
		var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/; 	//regex string that finds 3 matches of 3 numbers seperated by a comma and a space
		var matchArray = matchColors.exec(currentColor); 			//pushes the three matches to an array
		if (matchArray !== null) 							//if our backgroundColor was formatted with 2 commas and two spaces
		{ 											//it will match the regex and it won't be null
			if(!revert) // add 10 to each color value
			{
				var brightArray = matchArray.map(function(array) { array = parseInt(array) ? parseInt(array) + 10 : array; return array; });
			}
			else //subtract 10 to each color value
			{
				var brightArray = matchArray.map(function(array) { array = parseInt(array) ? parseInt(array) - 10 : array; return array; });
			}

			var newColor = 'rgb(' + brightArray[1] + ', ' + brightArray[2] + ', ' + brightArray[3] + ")"; 
			$(e).css("backgroundColor", newColor); //assign new color
		}
	}
}

function showToolTip(toolTipName, hide)
{
	if(!hide)
	{
		var $currentDiv = $("#" + toolTipName);
		var $myToolTipDiv = $("<div>");
		var toolTipCss =  {
						position: "absolute",
						top: ($currentDiv.offset().top + (104 / 2) - 20) + "px",
						left: ($currentDiv.offset().left + (104 + 10)) + "px"
					}
		$myToolTipDiv.css(toolTipCss);
		$myToolTipDiv.attr("id", toolTipName + "-toolTip");
		$myToolTipDiv.addClass("tool-tip");
		$myToolTipDiv.text(toolTips[toolTipName]);

		$('body').append($myToolTipDiv);
	}
	else
	{
		var $currentToolTip = $("#" + toolTipName + "-toolTip");

		$currentToolTip.css("animationDirection", "none");
		setTimeout( function () { $currentToolTip.css("animation", "toolTipOutro 250ms forwards"); }, 10);
		setTimeout( function () { $currentToolTip.remove(); }, 260);
	}
}

function playTopGif(e, stop)
{
	var currentImage = $(e).attr("src");
	var newImage = !stop ? currentImage.replace("giphy_s.gif", "giphy.gif") : currentImage.replace("giphy.gif", "giphy_s.gif");
	$(e).attr("src", newImage);
}

function attachCube(event, e, cube)
{
	$(e).off();
	brightenBackground(e, true); 
	showToolTip(e.parentElement.id, true);
	
	setTimeout(function () { $(e.parentElement).on("click", returnCube) }, 100);
	createPlacementCircle();

	$attachedCube = $(cube);
	$attachedCubeFront = $(e);
	cubeAttached = true;
	attachedLocationX_delta = event.pageX;
	attachedLocationY_delta = event.pageY;

	requestAnimationFrame(moveCube);
}

function moveCube() 
{
	var centerX = window.innerWidth / 2;

	//opacity logic
		var newCubeBackgroundOpacity = (attachedLocationX - attachedLocationX_delta) / (centerX - 56);
		newCubeBackgroundOpacity = 1 - (Math.round(newCubeBackgroundOpacity * 100) / 100);

		var currentBackground = $attachedCubeFront.css("backgroundColor");
		if(currentBackground.indexOf("rgb(") !== -1)
		{
			var newBackground = currentBackground.replace("rgb(", "rgba(");
			newBackground = newBackground.replace(/[)]$/, ", " + newCubeBackgroundOpacity + ")");
		}
		else
		{
			var newBackground = currentBackground.substring(0, currentBackground.lastIndexOf(","));
			newBackground = newBackground + ", " + newCubeBackgroundOpacity + ")";
		}
	//end opacity logic

	var newCSS = {};

	newCSS.left = (attachedLocationX - attachedLocationX_delta) + "px";
	newCSS.top = (attachedLocationY - attachedLocationY_delta) + "px";
	
	$attachedCube.css(newCSS);
	$attachedCubeFront.css("backgroundColor", newBackground);
	
	if(cubeAttached)
	{
		requestAnimationFrame(moveCube);
	}
}

function createPlacementCircle()
{
	var $myPlacementCircle = $("<div>");
	$myPlacementCircle.attr("id", "placementCircle");
	$myPlacementCircle.addClass("placement-circle");
	$myPlacementCircle.on("click", dropCube);

	$('body').append($myPlacementCircle);
}

function returnCube()
{
	$(this).off();
	$("#placementCircle").remove();

	$attachedCubeFront.on("mouseenter", function () { brightenBackground($attachedCubeFront[0], false); showToolTip($attachedCubeFront[0].parentElement.id, false); playTopGif($attachedCubeFront[0].firstChild, false); });
	$attachedCubeFront.on("mouseleave", function () { brightenBackground($attachedCubeFront[0], true); showToolTip($attachedCubeFront[0].parentElement.id, true); playTopGif($attachedCubeFront[0].firstChild, true); });
	
	cubeAttached = false;		

	$attachedCube.css("transition", "top 1s, left 1s");
	$attachedCubeFront.css("transition", "background-color 1s");

	var currentBackground = $attachedCubeFront.css("backgroundColor");
	var newBackground = currentBackground.substring(0, currentBackground.lastIndexOf(","));
	newBackground = newBackground + ")";
	newBackground = newBackground.replace("rgba(", "rgb(");

	setTimeout(function () { 
		$attachedCube.css({top: "0px", left: "0px"}); 					
		$attachedCubeFront.css({backgroundColor: newBackground});
	}, 30);

	setTimeout(function () { 
		$attachedCube.css("transition", "none"); 
		$attachedCubeFront.css("transition", "none");
	}, 1030);

	setTimeout( function () {
			playTopGif($attachedCubeFront[0].firstChild, true);
			$attachedCubeFront.on("click", function (event) { attachCube(event, $attachedCubeFront[0], $attachedCubeFront[0].parentElement.parentElement) });
	}, 1030);

	}

function dropCube()
{
	$(this).off();
	$("#placementCircle").remove();

	cubeAttached = false;

	/*$attachedCube.css("perspectiveOrigin", "50% 50%");
	$attachedCube.css("transform", "translateX(-106px)");
	$($attachedCube[0].firstChild).css("transformOrigin", "50% 50%");
	$($attachedCube[0].firstChild).css("transform", "scale(1,1)");
	$($attachedCube[0].firstChild).css("animation", "rotate 20s linear infinite");*/
}

