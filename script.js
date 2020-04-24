/* Forked from Daniel Shiffman
http://codingtra.in
*/

var blueSnake;
var redSnake;
// Cette variable permet d'avoir une mesure sous forme de grille
var gridCell = 20;
var food;
function setup() {
  // On crée le canvas, la surface sur laquelle on va dessiner nos formes
  createCanvas(600, 600);

  // On crée une instance du snake depuis le constructeur snake ->> voir plus bas pour ce dernier
  blueSnake = new Snake(0,0);
    redSnake = new Snake(0,600);


  // On modifie la framerate, car sinon on ne pourrait pas s'aperçevoir que le serpent bouge case par case
  frameRate(10);
  //
  pickFoodLocation();
}

function pickFoodLocation() {
  // On cherche le nombre de colonne et de lignes sur la scène, mais pour cela on veut un nombre entier, on utilise la fonction floor pour cette raison
  var cols = floor(width / gridCell);
  var rows = floor(height / gridCell);
  // createVector est une façon rapide et simplifiée de stocker un x et un y. Cela crée ces deux propriété dans l'objet food
  food = createVector(floor(random(cols)), floor(random(rows)));
  // Pour avoir un résultat réel, on multiplie le nombre de colonnes / lignes par l'unité de mesure de la grille
  food.mult(gridCell);
}
function collisionSnakes() {
  for (var i = 0; i < redSnake.tail.length; i++) {
    for (var j = 0; j < blueSnake.tail.length; j++) {
      var dRB = dist(redSnake.tail[i].x, redSnake.tail[i].y, blueSnake.tail[j].x,blueSnake.tail[j].y);

      if (dRB < 1) {
alert("game over");
redSnake.total = 0;
        blueSnake.total = 0;


        redSnake.tail = [];
                blueSnake.tail = [];


      }
    }
  }


  }
// La fonction draw est exécutée à l'infinie, en boucle
function draw() {
  background(51);
  fill(255);
  textSize(14);
  text("Cliquez sur le jeu pour commencer",15,20);

  text("Noir = W,A,S,D",15,40);
    text("Blanc = I, J, K, L",15,60);


  if (blueSnake.eat(food) || redSnake.eat(food)) {
    pickFoodLocation();
  }
  // Aussi executé enboucle
  blueSnake.death();
  blueSnake.update();
  blueSnake.show(255);
  redSnake.death();
  redSnake.update();
  redSnake.show(0);
  collisionSnakes();
  // Rempli en rouge la nourriture
  fill(255, 0, 100);
  rect(food.x, food.y, gridCell, gridCell);
}

  // On cherche si un carré touche le carré de l'autre snake 
  /*
  for
       var dSnakes= dist(redSnake.pos.x, redSnake.pos.y, blueSnake.pos.x, blueSnake.pos.y);
      if (dSnakes < 1) {
alert("game over");
this.total = 0;
        this.tail = [];
      }
      */        
// Gestionnaire d'événement pour les touches directionnelles
function keyPressed() {
  if (keyCode === 73 && blueSnake.yspeed != 1) {
    blueSnake.changeDirection(0, -1);
  } else if (keyCode === 75&& blueSnake.yspeed != -1) {
    blueSnake.changeDirection(0, 1);
  } else if (keyCode === 76&& blueSnake.xspeed != -1) {
    blueSnake.changeDirection(1, 0);
  } else if (keyCode === 74 && blueSnake.xspeed != 1) {
    blueSnake.changeDirection(-1, 0);
  }
  if (keyCode === 87 && redSnake.yspeed != 1) {
    redSnake.changeDirection(0, -1);
  } else if (keyCode === 83 && redSnake.yspeed != -1) {
    redSnake.changeDirection(0, 1);
  } else if (keyCode === 68 && redSnake.xspeed != -1) {
    redSnake.changeDirection(1, 0);
  } else if (keyCode === 65 && redSnake.xspeed != 1) {
    redSnake.changeDirection(-1, 0);
  }
}

// CONSTRUCTEUR DU blueSnake
function Snake(x, y) {
  this.x = x;
  this.y = y;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  
  this.eat = function(pos) {
    // La fonction dist évalue la distance entre deux point
    var d = dist(this.x, this.y, pos.x, pos.y);
    /* Si la tête du snake est très proche de la nourriture, 
    on augmente le total de ses carrés et la fonction 
retournera true lorsque la nourriture aura été mangée */
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  };
  // Cette fonction qui accepte deux paramètres, permet de déterminer la changeDirectionection du blueSnake
  this.changeDirection = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };

  this.death = function() {
    // On évalue ici si le serpent touche sa propre queue
    for (var i = 0; i < this.tail.length; i++) {
      // Pour cela on boucle sur tout les carrés
      var pos = this.tail[i];
      // et on évalue la distance qui la sépare de la tête pour chacun d'eux
      var d = dist(this.x, this.y, pos.x, pos.y);
      // si il se rapproche, on tue le serpent, plus de carrés dans l'Array
      if (d < 1) {
        // alert("game over");
this.total = 0;
        this.tail = [];
      }
    }
  };

  this.update = function() {
    for (var i = 0; i < this.tail.length - 1; i++) {
      // On boucle sur la queue du serpent, afin de déplacer chaque carré d'un case, ou d'un indice de tableau
      this.tail[i] = this.tail[i + 1];
    }
    if (this.total >= 1) {
      // On ajoute dans le tableau, un carré de plus à la position actuelle
      this.tail[this.total - 1] = createVector(this.x, this.y);
    }
    // Gestion du déplacement du snake
    /* On ajoute la vitesse prédéfinie plutôt sur l'axe horizontale, puis on multiplie cette valeur par le facteur de l'unité de mesure de la grille */
    this.x = this.x + this.xspeed * gridCell;
    this.y = this.y + this.yspeed * gridCell;
    // Gère les collisions entre le serpent et la largeur et hauteur du canvas
    this.x = constrain(this.x, 0, width - gridCell);
    this.y = constrain(this.y, 0, height - gridCell);
  };
  // Affiche le serpent et sa queue
  this.show = function(color) {
    // blanc
    fill(color);
    for (var i = 0; i < this.tail.length; i++) {
      /* On boucle sur le tableau de la queue du serpent pour afficher chaque carré
 qui ont reçu les propriétés x et y à l'aide de la fonction createVector vu plus haut */
      rect(this.tail[i].x, this.tail[i].y, gridCell, gridCell);
    }
    // Afficher le premier carré
    rect(this.x, this.y, gridCell, gridCell);
  };
}