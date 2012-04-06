/* 	slidePulpe plugin v2.2 - 02/01/2012
	Catapulpe Production 2012
	Développé par Léo pour sans-sucre-ajoute.com 
*/
(function($){
	//Construction du slideshow
	$.fn.makeSlidePulpe = function(variable){
		//Variables de configuration par défaut
		var defaults = {
			auto: true,
			time: 250,
			transition: 400,
			effet: 'easeOutQuad',
			fleches: true,
			boutons: true
		};
		//Changement des variables de configuration par défaut par les nouvelles voulues
		var options = $.extend(defaults, variable);
		//Recupération de la balise galerie
		var galerie = this;
		//Variables temporaires comprenant les positions courantes, dimensions...
		var v = {
			slideSens:'right',
			currentPos: 0,
			oldPos: 0,
			totSucre: 0,
			slideWidth: '0px'
		};
		//Fonction de calcul de position et lancement de l'animation
		var controleur = function() {
			if(options.auto) clearTimeout(timeOut);
			v.oldPos=v.currentPos;
			if($(this).attr('class')=='fleche') {
				if($(this).attr('id')=='right') {
					(v.currentPos==v.totSucre-1) ? v.currentPos=0 : v.currentPos+=1;
					v.slideSens='right';
				} else {
					(v.currentPos==0) ? v.currentPos=v.totSucre-1 : v.currentPos-=1;
					v.slideSens='left';
				}
			} else {
				v.currentPos = $(this).attr('id')-1;
				if((v.currentPos-v.oldPos)>0) {
					v.slideSens='right';
				} else {
					v.slideSens='left';
				}
			}
			galerie.animeSlidePulpe(options,v,controleur);
			if(options.auto) timeOut = setTimeout(function(){autoAnim();},options.time);
		}
		//Assigne la fonction controleur à l'évènement click
		if(options.fleches) {
			$('#contenu').after('<div id="left" class="fleche"></div><div id="right" class="fleche"></div>');
			$('.fleche').bind('click', controleur);
		}	
		//Création des boutons et flèches de controles
		if(options.boutons) $('#contenu').after('<ul id="thumbs"></ul>');
		//Compte le nombres d'éléments
		this.children('div').each(function(i){
			if(i!=0) $(this).css('left',$(this).width()+'px');
			$(this).attr('id','img'+i);
			v.totSucre+=1;
			v.slideWidth=$(this).width();
			//Ajoute un élément bouton pour chaques éléments de la galerie
			if(options.boutons) $('#thumbs').append('<li class="bouton" id="'+(i+1)+'"></li>');
		});
		if(options.boutons) {
			//Ajoute la classe survol au premier bouton
			$('.bouton:first').addClass('survol');
			$('.bouton').not('.survol').bind('click', controleur);
		}
		//Fonction permettant le lancement automatique
		function autoAnim(){
			v.oldPos=v.currentPos;
			v.slideSens = 'right';
			if(v.currentPos==v.totSucre-1){ v.currentPos=0; } else { v.currentPos+=1; }
			galerie.animeSlidePulpe(options,v,controleur);
			timeOut = setTimeout(autoAnim,options.time);
		};
		//Appel de la fonction automatique
		(options.auto) ? timeOut = setTimeout(autoAnim,options.time) : timeOut = 0;
		
		return this;
	};
	//Fonction d'animation classique du diaporama
	$.fn.animeSlidePulpe = function(options,v,controleur){
		if(options.fleches) $('.fleche').unbind('click', controleur);
		if(options.boutons) { 
			$('.bouton').unbind('click', controleur);
			$('.bouton').removeClass('survol');
			$('#'+(v.currentPos+1)).addClass('survol');
		}
		var signe=0;
		(v.slideSens=='right') ? signe-=1 : signe+=1;
		$('#img'+v.currentPos).css('left',-(signe*v.slideWidth)+'px');
		$('#img'+v.oldPos).stop().animate( {
				left:(signe*v.slideWidth)+'px'
			}, {
				duration: options.transition,
				specialEasing: { left: options.effet }
			}
		);
		
		$('#img'+v.currentPos).stop().animate( {
				left:'0px'
			}, {
				duration: options.transition,
				specialEasing: { left: options.effet },
				complete: function() {
					if(options.fleches) $('.fleche').bind('click', controleur);
					if(options.boutons) $('.bouton').not('.survol').bind('click', controleur);
				}
			}
		);
		return this;
	};
})(jQuery);