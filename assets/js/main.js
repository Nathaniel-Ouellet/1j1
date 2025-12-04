/**
* @author Nathaniel Ouellet
* @version 0.0.1

* @type {HTMLCanvasElement}
*/

let oCanvas = document.querySelector("#canvasMain");
let oCtx = oCanvas.getContext("2d");
// La taille du canvas deviens la taille de la page
oCanvas.width = window.innerWidth;
oCanvas.height = window.innerHeight;

// Chargement des images
const oImgKitr = new Image();
oImgKitr.src = "assets/images/kitr.png";
const oImgLangues = new Image();
oImgLangues.src = "https://s2.svgbox.net/octicons.svg?ic=globe-bold";
const oImgRejouer = new Image();
oImgRejouer.src = "https://s2.svgbox.net/materialui.svg?ic=loop";
const oImgQuitter = new Image();
oImgQuitter.src = "https://s2.svgbox.net/octicons.svg?ic=x-bold";

// Chargement des sons
const oAudBipCourt = new Audio();
oAudBipCourt.src = "assets/audio/bip-court.wav";
oAudBipCourt.volume = 0.45;
const oAudBipLong = new Audio();
oAudBipLong.src = "assets/audio/bip-long.wav";
oAudBipLong.volume = 0.45;

const oAudSonTexte01 = new Audio();
oAudSonTexte01.src = "assets/audio/son-texte-01.wav";
const oAudSonTexte02 = new Audio();
oAudSonTexte02.src = "assets/audio/son-texte-02.wav";
const oAudSonTexte03 = new Audio();
oAudSonTexte03.src = "assets/audio/son-texte-03.wav";
const oAudSonTexte04 = new Audio();
oAudSonTexte04.src = "assets/audio/son-texte-04.wav";
const oAudSonTexte05 = new Audio();
oAudSonTexte05.src = "assets/audio/son-texte-05.wav";
const oAudSonTexte06 = new Audio();
oAudSonTexte06.src = "assets/audio/son-texte-06.wav";
let aAudSonsTexte = [oAudSonTexte01, oAudSonTexte02, oAudSonTexte03, oAudSonTexte04, oAudSonTexte05, oAudSonTexte06];


// Quelques variables globales

// Raccourci pour obtenir la taille du canvas plus rapidement, on vas en avoir besoin souvent !
let nCanvasLargeur = oCanvas.width;
let nCanvasHauteur = oCanvas.height;

let nVitesseJeu = 1000 / 60; // Temps entre chaque boucle de jeu (en ms), autrement dit la vitesse du jeu

// Des variables importantes pour le comportement du programme
let oSouris = {};
let aBoutons = [];
let nTitreTimer = 0; // Animation du titre
let bDebug = false; // Mode débug, active quelques choses dans le programme
// Pour les dialogues
let sAncienDialogue = "";
let aNouveauDialogue = [""];
let nDialogueCharactere = 0;
let nDialogueDelai = 0;
let nDialogueLigne = 0;
let nDialogueFlash = 200;
let bDialogueFlashBaisse = false;
let oVariablesJeu = {
    bQuitter: false,
    bQuitterPermis: false,
    bTutoriel: true,
    bFin: false,
    nTutorielLettres: 0,
    nLettresMax: 4,
    nLettresCorrectes: 0,
    bAfficherProgres: false,
    sEtatJeu: "MenuPrincipal",
    bAfficherClavier: false,
    bAccepteTouches: false,
    bKitrActive: false,
    sNouvelleLettre: "LETTRE PAR DÉFAUT",
    bNouvelleLettre: false,
    oLettreActuelle: { lettre: "e", code: "." },
    nIndicateurTimer: 0,
    bRejouerPermis: false,
    bInputJoueur: false
};
let aLettresSac = [];
let aLettres = [];
let aLettresBloquees = [ // Toutes les lettres de l'alphabet et leur code en morse
    { lettre: "a", code: ".-" },
    { lettre: "b", code: "-..." },
    { lettre: "c", code: "-.-." },
    { lettre: "d", code: "-.." },
    { lettre: "e", code: "." },
    { lettre: "f", code: "..-." },
    { lettre: "g", code: "--." },
    { lettre: "h", code: "...." },
    { lettre: "i", code: ".." },
    { lettre: "j", code: ".---" },
    { lettre: "k", code: "-.-" },
    { lettre: "l", code: ".-.." },
    { lettre: "m", code: "--" },
    { lettre: "n", code: "-." },
    { lettre: "o", code: "---" },
    { lettre: "p", code: ".--." },
    { lettre: "q", code: "--.-" },
    { lettre: "r", code: ".-." },
    { lettre: "s", code: "..." },
    { lettre: "t", code: "-" },
    { lettre: "u", code: "..-" },
    { lettre: "v", code: "...-" },
    { lettre: "w", code: ".--" },
    { lettre: "x", code: "-..-" },
    { lettre: "y", code: "-.--" },
    { lettre: "z", code: "--.." },
];

// Création de l'objet KITR avec ses variables
let oKitr = {
    aKitrPositions: [],
    nKitrEtapePosition: 0,
    nKitrX: {
        base: 0 - (pourcentageCanvas(0.5)),
        debut: 0,
        fin: 0,
        relatif: 0
    },
    nKitrY: {
        base: (nCanvasHauteur / 2) - 128,
        debut: 0,
        fin: 0,
        relatif: 0
    },
    nKitrBougerTimer: 0,
    nKitrTempsBoucles: 0,
    aDialogue: [""],
    bParle: false,
    bEnMouvement: false
};
oKitr.nKitrX.debut = oKitr.nKitrX.base;
oKitr.nKitrY.debut = oKitr.nKitrY.base;
oKitr.nKitrX.fin = oKitr.nKitrX.base;
oKitr.nKitrY.fin = oKitr.nKitrY.base;
oKitr.nKitrX.relatif = oKitr.nKitrX.base;
oKitr.nKitrY.relatif = oKitr.nKitrY.base;

let oTextes = {
    fr: {
        sLangue: "Français",

        // Menu Principal
        sMenuPrincipalBoutonJouer: "Jouer",

        // Textes KITR
        sKitrDebut01: "Hey ! Salut, j'aurais besoin de ton aide.",
        sKitrDebut02: "J'ai perdu toutes les touches de mon clavier !",
        sKitrDebut03: "Je n'ai trouvé que deux lettres, la lettre ¦.",
        sKitrDebut04: "Et la lettre ¦.",
        sKitrDebut05: "C'est difficile de trouver les touches sans aide, mais vu qu'elles font du bruit lorsqu'on appuie sur la bonne touche, ça m'aiderait beaucoup si tu pouvais écrire les bonnes lettres pendant que je cherche.",
        sKitrDebut06: "Par contre, c'est en code morse.",
        sKitrDebut07: "Tu ne connais pas le code morse ? Ne t'inquiète pas, je vais te montrer.",
        sKitrDebut08: "Le code morse utilise deux signaux : un court et un long. Ils sont représentés avec « • » et « − » respectivement.",
        sKitrDebut09: "Chaque lettre a sa séquence, par exemple, la lettre E est « • » et T est « − ».",
        sKitrDebut10: "Si tu veux rejouer la séquence, appuie sur le bouton « Rejouer ».",
        sKitrDebut11: "Essayons un coup avec la lettre E pour voir.",
        sKitrTutorielEncore: "Bien ! Essayons encore avec une lettre au hazard.",
        sKitrTutorielFin: "Parfait ! Pratique-toi pendant que je continue de chercher.",
        sKitrNouvelleManche: "Super ! Maintenant essaie avec les autres lettres. Je vais retourner à la recherche des touches manquantes.",
        sKitrNouvelleLettre01: "Bien joué ! Je viens justement de trouver une nouvelle touche de mon clavier.",
        sKitrNouvelleLettre02: "La voici : la lettre ¦ !",
        sKitrNouvelleLettre03: "Essayons un coup pour s'assurer que tu connaisse la séquence de celle-ci.",
        sKitrFin01: "Oh wow ! On a réussi à retrouver toutes les lettres de mon clavier ! Merci infininement, je n'aurais pas réussi sans ton aide.",
        sKitrFin02: "Bien, maintenant je suppose que tu n'as plus besoin de continuer, mais si tu veux quand-même, je peut te laisser te pratiquer.",
        sKitrFin03: "Peu importe...",
        sKitrNouvelleMancheFin01: "Tu connais maintenant toutes les lettres en code morse !",
        sKitrNouvelleMancheFin02: "Comme je t'ai dit, je n'ai pas besoin de mon clavier pour l'instant, donc tu es libre de rester te pratiquer avec.",
        sKitrNouvelleMancheFin03: "À la prochaine fois !",
        sKitrPromptDialogue: "Appuyez sur ESPACE pour continer.",

        // Jeu Principal
        sJeuBoutonQuitter: "Quitter",
        sJeuBoutonRejouer: "Rejouer",

        // Menu Quitter
        sQuitterBoutonQuitter: "QUITTER",
        sQuitterBoutonRester: "RESTER",
        sQuitterQuestion: "Voulez-vous vraiment quitter ?",
        sQuitterAvertissement: "Votre progression sera perdue.",

        // Debug
        sDebugAjouter: "AJOUTER LETTRE",
        sDebugSkip: "SKIP LETTRE",
    },
    en: {
        sLangue: "English",

        // Menu Principal
        sMenuPrincipalBoutonJouer: "Play",

        // Textes KITR
        sKitrDebut01: "Hey there! Would you care to help me?",
        sKitrDebut02: "I lost all of my keyboard's keys!",
        sKitrDebut03: "I only found two letters back, the letter ¦.",
        sKitrDebut04: "And the letter ¦.",
        sKitrDebut05: "It's hard to find them without help, but since they make sound whenever you press the right key, it would help me a ton if you were to do just that while I'm looking for them.",
        sKitrDebut06: "But I should tell you first, it's all in morse code.",
        sKitrDebut07: "You don't know morse code? Don't worry, I'll teach you.",
        sKitrDebut08: "Morse code uses two signals: a short one and a long one. They are represented by \"•\" and \"−\" respectively.",
        sKitrDebut09: "Each letter is represented by a sequence. For example, the letter E is \"•\" and T is \"−\".",
        sKitrDebut10: "If you want to see the sequence again, press the button \"Replay\".",
        sKitrDebut11: "Let's try this out with the letter E to see.",
        sKitrTutorielEncore: "Great! Let's do this again.",
        sKitrTutorielFin: "Awesome! Practice this a bit while I'm looking for keys.",
        sKitrNouvelleManche: "Great! Now continue with all of the other letters, I'll be looking for keys in the meantime.",
        sKitrNouvelleLettre01: "Well done! I just found another missing key back.",
        sKitrNouvelleLettre02: "Here it is, the letter ¦!",
        sKitrNouvelleLettre03: "Let's try it to make sure you are familiar with its sequence.",
        sKitrFin01: "Oh wow! We managed to get all of the keys back on my keyboard! Thank you so much, I couldn't have done it without your help!",
        sKitrFin02: "Well, now you don't have to do anything, but if you'd like, I can let you continue practicing.",
        sKitrFin03: "Regardless...",
        sKitrNouvelleMancheFin01: "You now know every letter in morse code !",
        sKitrNouvelleMancheFin02: "As I said, I don't need my keyboard for the time being, so feel free to stay here and practice with it.",
        sKitrNouvelleMancheFin03: "So, until next time!",
        sKitrPromptDialogue: "Press SPACE to continue.",

        // Jeu Principal
        sJeuBoutonQuitter: "Quit",
        sJeuBoutonRejouer: "Replay",

        // Menu Quitter
        sQuitterBoutonQuitter: "QUIT",
        sQuitterBoutonRester: "STAY",
        sQuitterQuestion: "Do you really want to leave?",
        sQuitterAvertissement: "Your progression WILL be lost.",

        // Debug
        sDebugAjouter: "ADD LETTER",
        sDebugSkip: "SKIP LETTER",
    },
};
let langue = "fr";

/* ---------------------------------------------------------- */
/* ------------------    ÉVENEMENTS     --------------------- */
/* ---------------------------------------------------------- */

// Gestion des évenements
window.addEventListener("load", init);
document.addEventListener("keydown", clavierPhysique);
oCanvas.addEventListener("click", sourisClic);
oCanvas.addEventListener("mousemove", sourisMovement);

/**
 * Enregistre la position de la souris
 * @param {*} evt Évènement de souris
 */
function sourisMovement(evt) {
    oSouris = evt;
}

/**
 * Réagit aux clics du joueur
 * @param {*} evt Évènement de souris
 */
function sourisClic(evt) {
    // Faux-bouton de la boîte de dialogue de KITR
    if (evt.offsetX >= (pourcentageCanvas(0.5)) - 350 && evt.offsetX <= (pourcentageCanvas(0.5)) + 350 && evt.offsetY >= 25 && evt.offsetY <= 225) {
        clavierPhysique({ key: " " });
        return; // Skip tout les autres boutons.
    }

    let oBouton = {};
    for (let i = 0; i < aBoutons.length; i++) {
        oBouton = aBoutons[i];
        if (evt.offsetX >= oBouton.nX && evt.offsetX <= oBouton.nX + oBouton.nLargeur && evt.offsetY >= oBouton.nY && evt.offsetY <= oBouton.nY + oBouton.nHauteur && oBouton.bActive) {
            if (oBouton.sSousTitre.toLocaleLowerCase() == oTextes[langue].sJeuBoutonQuitter.toLocaleLowerCase() && !oVariablesJeu.bQuitterPermis) {
                continue;
            }
            if (oBouton.sSousTitre.toLocaleLowerCase() != "quittermenu" && oVariablesJeu.bQuitter) {
                continue;
            }
            oBouton.mAction(oBouton.parametre, oBouton.parametre2);
            if (oBouton.bUsageUnique) {
                aBoutons.splice(i, 1); // Si le bouton est à usage unique, aller dans l'array à la position du bouton (i) et supprimer x (1) pour supprimer ce bouton.
            }
            return; // Skip tout les autres boutons après avoir appuyé sur un bouton.
        }
    }
}

/**
 * Réagit aux touches du clavier
 * @param {*} evt Évènement de clavier
 */
function clavierPhysique(evt) {
    if (oVariablesJeu.sEtatJeu != "MenuPrincipal" && !oVariablesJeu.bQuitter && !evt.repeat) {
        switch (evt.key.toLowerCase()) {
            case " ": case "enter":
                if (!oVariablesJeu.bKitrActive) {
                    break;
                }
                oKitr.nKitrEtapePosition++;
                if (oKitr.nKitrEtapePosition < oKitr.aKitrPositions.length) {
                    changerDestinationKitr(oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nX, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nY, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nVitesse, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].aDialogue, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].mAction, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre2, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre3);
                } else {
                    // oKitr.nKitrBougerTimer = oKitr.nKitrTempsBoucles - 1;
                    console.log("Fin de la liste de positions de KITR!");
                    oKitr.nKitrEtapePosition--; // On reviens à la dernière position pour pouvoir passer à la prochaine position correctement si il y en a plus de rajouté plus tard.
                }
                break;

            case "a": case "b": case "c": case "d": case "e": case "f": case "g": case "h": case "i": case "j": case "k": case "l": case "m": case "n": case "o": case "p": case "q": case "r": case "s": case "t": case "u": case "v": case "w": case "x": case "y": case "z": // Toutes les lettres de l'alphabet
                lettreEntree(evt.key.toLowerCase());
                break;

            default:
                break;
        }
    }
}

/* ---------------------------------------------------------- */
/* ------------------     FONCTIONS     --------------------- */
/* ---------------------------------------------------------- */

/**
 * Initialisation de l'état de base
 */
function init() {
    creerNouveauBouton(pourcentageCanvas(0.5) + 30, pourcentageCanvas(0.5, true) - 75, 300, 100, "sMenuPrincipalBoutonJouer", "", true, true, demarrerJeu);
    creerNouveauBouton(pourcentageCanvas(1) - 92, 30, 62, 62, "", "sLangue", true, false, changerLangue);

    let boucleJeuInterval = setInterval(boucleJeu, nVitesseJeu);
}

/*
    Les données préparatoires sont maitenant toutes gérées et chargées,
    maintenant nous aurons des fonctions qui vont gérer la logique du jeu.
*/

/**
 * Boucle de jeu principale
 */
function boucleJeu() {
    viderCanvas();
    // afficher seulement le menu "Quitter" lorsqu'il est actif
    if (oVariablesJeu.bQuitter) {
        afficherQuitter();
        afficherBoutons();
        return; // ...Et on affiche/calcule rien d'autre
    }
    // Changer la logique exécutée dépendamment de si nous sommes sur le menu principal ou en jeu
    switch (oVariablesJeu.sEtatJeu) {
        case "MenuPrincipal":
            titrePrincipal();
            break;

        case "JeuPrincipal":
            jeuPrincipal();
            break;

        default:
            break;
    }
    afficherBoutons();
    if (oVariablesJeu.sEtatJeu != "MenuPrincipal") {
        kitr();
    }
}

/**
 * Dessine le titre principal
 */
function titrePrincipal() {
    nTitreTimer++;

    // Position relative du titre, pratique pour tout déplacer comme un bloc
    let nTitreX = pourcentageCanvas(1 / 3);
    let nTitreY = pourcentageCanvas(0.5, true);

    // Petite animation qui monte le titre au début
    if (nTitreTimer < 60) {
        nTitreY += (60 - nTitreTimer);
    }

    oCtx.font = "120px monospace";
    oCtx.fillStyle = "rgb(0, 0, 0, " + (nTitreTimer / 85) + ")";

    oCtx.beginPath();
    // Titre lettres
    oCtx.fillText("K", nTitreX, nTitreY - 180);
    oCtx.fillText("I", nTitreX, nTitreY - 60);
    oCtx.fillText("T", nTitreX, nTitreY + 60);
    oCtx.fillText("R", nTitreX, nTitreY + 180);
    // Titre Barre
    oCtx.fillRect(nTitreX + 80, nTitreY - 275, 5, 480);
    // Titre morse
    oCtx.fillText("−•−", nTitreX + 100, nTitreY - 180);
    oCtx.fillText("••", nTitreX + 100, nTitreY - 60);
    oCtx.fillText("−", nTitreX + 100, nTitreY + 60);
    oCtx.fillText("•−•", nTitreX + 100, nTitreY + 180);
    oCtx.closePath();
}

/**
 * La logique du jeu
 */
function jeuPrincipal() {
    afficherIndicateur();

    if (oVariablesJeu.bAfficherProgres) {
        let nProgressionX = pourcentageCanvas(0.5);
        let nProgressionY = pourcentageCanvas(0.75, true) - 60;
        oCtx.save();
        oCtx.fillStyle = "#333333ff";
        oCtx.fillRect(nProgressionX - 90, nProgressionY - 15, 180, 30);
        oCtx.fillStyle = "#22bb22ff";
        oCtx.fillRect(nProgressionX - 88, nProgressionY - 13, Math.min(176, Math.max((176 * ((oVariablesJeu.nLettresCorrectes) / oVariablesJeu.nLettresMax)), 0)), 26);
        oCtx.restore();
    }

    if (bDebug) {
        oCtx.fillText(oVariablesJeu.oLettreActuelle.lettre, pourcentageCanvas(0.29), pourcentageCanvas(0.75, true));
    }
}

/**
 * Démarre le jeu
 */
function demarrerJeu() {
    oVariablesJeu.sEtatJeu = "JeuPrincipal";
    aBoutons = [];

    creerPositionKitr(pourcentageCanvas(-0.5), pourcentageCanvas(0.5, true), 1, "");
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 140, "");
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut01, changerVariable, "bKitrActive", true);
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut02, creerClavier);
    creerPositionKitr(pourcentageCanvas(0.4), pourcentageCanvas(0.5, true), 15, oTextes[langue].sKitrDebut03, ajouterLettre, "e");
    creerPositionKitr(pourcentageCanvas(0.6), pourcentageCanvas(0.5, true), 15, oTextes[langue].sKitrDebut04, ajouterLettre, "t");
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 15, oTextes[langue].sKitrDebut05);
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut06);
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut07);
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 8, oTextes[langue].sKitrDebut08);
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut09);
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut10, creerBoutonRejouer);
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrDebut11, nouvelleManche);
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, "", lettreSuivante, oVariablesJeu.oLettreActuelle.lettre, oVariablesJeu.oLettreActuelle.code);
    setTimeout(creerNouveauBouton, 1, 30, 30, 62, 62, "", oTextes[langue].sJeuBoutonQuitter, true, true, activerQuitter);

    // Mettre KITR à la position 0
    changerDestinationKitr(oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nX, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nY, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nVitesse, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].aDialogue, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].mAction, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre2, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre3);

    setTimeout(changerVariable, 141 * nVitesseJeu, "bQuitterPermis", true);
    oKitr.nKitrEtapePosition++;
    changerDestinationKitr(oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nX, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nY, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nVitesse, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].aDialogue, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].mAction, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre2, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre3);
    oKitr.nKitrEtapePosition++;
    setTimeout(changerDestinationKitr, 141 * nVitesseJeu, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nX, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nY, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].nVitesse, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].aDialogue, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].mAction, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre2, oKitr.aKitrPositions[oKitr.nKitrEtapePosition].parametre3);
}

/**
 * Termine le tutoriel
 */
function finirTutoriel() {
    oVariablesJeu.bTutoriel = false;
    nouvelleManche();
    setTimeout(changerVariable, 800, "bQuitterPermis", true);
    setTimeout(creerPositionKitr, 800, pourcentageCanvas(1.5), pourcentageCanvas(0.5, true), 1, "", lettreSuivante);
    setTimeout(clavierPhysique, 800, { key: " " });
}

/**
 * Affiche le menu utilisé pour revenir au menu principal
 */
function afficherQuitter() {
    let nPosX = pourcentageCanvas(0.5);
    let nPosY = pourcentageCanvas(0.5, true);
    let nLargeur;
    let nHauteur;
    nPosX -= nLargeur / 2;
    nPosY -= nHauteur / 2;

    oCtx.save();
    oCtx.fillStyle = "#aaaaaa";
    oCtx.fillRect(0, 0, pourcentageCanvas(1), pourcentageCanvas(1, true));
    oCtx.fillStyle = "#000000";
    oCtx.textAlign = "center";
    oCtx.font = "56px Outfit";
    oCtx.fillText(oTextes[langue].sQuitterQuestion, pourcentageCanvas(0.5), pourcentageCanvas(0.5, true) - 150);
    oCtx.fillStyle = "#dd0000";
    oCtx.textAlign = "center";
    oCtx.font = "24px Outfit";
    oCtx.fillText(oTextes[langue].sQuitterAvertissement, pourcentageCanvas(0.5), pourcentageCanvas(0.5, true) - 100);
    oCtx.restore();
}

/**
 * Active le menu "Quitter"
 */
function activerQuitter() {
    oVariablesJeu.bQuitter = true;
    creerNouveauBouton(pourcentageCanvas(0.5) - 350, pourcentageCanvas(0.5, true) - 50, 300, 100, oTextes[langue].sQuitterBoutonQuitter, "quittermenu", true, false, retourMenu);
    creerNouveauBouton(pourcentageCanvas(0.5) + 50, pourcentageCanvas(0.5, true) - 50, 300, 100, oTextes[langue].sQuitterBoutonRester, "quittermenu", true, false, desactiverQuitter);
}

/**
 * Désactive le menu "Quitter"
 */
function desactiverQuitter() {
    oVariablesJeu.bQuitter = false;
    creerNouveauBouton(30, 30, 62, 62, "", oTextes[langue].sJeuBoutonQuitter, true, true, activerQuitter);
    for (let i = 0; i < aBoutons.length; i++) {
        let oBouton = aBoutons[i];
        if (oBouton.sSousTitre == "quittermenu") {
            aBoutons.splice(i, 1);
            i--;
        }
    }
}

/**
 * Section de la boucle de jeu qui gère l'affichage de KITR
 */
function kitr() {
    oKitr.nKitrX.relatif = oKitr.nKitrX.base;
    oKitr.nKitrY.relatif = oKitr.nKitrY.base;
    bougerKitr();
    parlerKitr();

    oCtx.drawImage(oImgKitr, oKitr.nKitrX.relatif, oKitr.nKitrY.relatif);

    oCtx.globalAlpha = 1;
}

/**
 * Crée une nouvelle position pour KITR
 * @param {number} nPosX La position horizontale de KITR
 * @param {number} nPosY La position verticale de KITR
 * @param {number} nTempsAnimation Le temps que prends l'animation
 * @param {string} sDialogue Le dialogue à écrire
 * @param {method} mAction La fonction appelé
 * @param {*} parametre Le premier paramètre passé à la fonction
 * @param {*} parametre2 Le deuxième paramètre passé à la fonction
 * @param {*} parametre3 Le troisième paramètre passé à la fonction
 */
function creerPositionKitr(nPosX = pourcentageCanvas(0.5), nPosY = pourcentageCanvas(0.5, true), nTempsAnimation = 75, sDialogue = "", mAction = null, parametre = null, parametre2 = null, parametre3 = null) {
    let oPosition;

    // Gestion des dialogues, on met des retours de ligne lorsque le texte devient trop long à la place des espaces
    oCtx.font = "22px Outfit";
    let nDernierEspace = 0;
    let nDernierRetour = 0;
    let bDansGuillemets = false; // Cette condition évite de découper à l'intérieur des guillemets
    for (let i = 0; i < sDialogue.length; i++) {
        if (sDialogue.charAt(i) == "«") {
            bDansGuillemets = true;
        }
        if (sDialogue.charAt(i) == "»") {
            bDansGuillemets = false;
        }
        // Si le charactère est " (guillemet anglais) alors on inverse
        if (sDialogue.charAt(i) == "\"") {
            bDansGuillemets = !bDansGuillemets;
        }
        if (sDialogue.charAt(i) == " " && !bDansGuillemets) {
            nDernierEspace = i;
        }
        if (oCtx.measureText(sDialogue.slice(nDernierRetour + 1, i)).width >= 645 && !bDansGuillemets) {
            sDialogue = sDialogue.slice(0, nDernierEspace) + "§#" + sDialogue.slice(nDernierEspace + 1, sDialogue.length);
            nDernierRetour = i;
        }
    }
    let aDialogue = sDialogue.split("#"); // Divise le string en plusieurs strings. Chaque coupure arrive lorsqu'il trouve un "#"

    oPosition = {
        nX: nPosX - oImgKitr.width / 2, // Automatiquement centrer la position sur le millieu de l'image
        nY: nPosY - oImgKitr.height / 2, // Automatiquement centrer la position sur le millieu de l'image
        nVitesse: nTempsAnimation,
        aDialogue: aDialogue,
        mAction: mAction,
        parametre: parametre,
        parametre2: parametre2,
        parametre3: parametre3
    };
    oKitr.aKitrPositions[oKitr.aKitrPositions.length] = oPosition;
}

/**
 * Change la destination finale de KITR et interromps le mouvement actuel s'il y a lieu.
 * @param {number} xFin Position horizontale
 * @param {number} yFin Position verticale
 * @param {number} tempsAnim Temps que le mouvement va prendre
 * @param {array} aDialogue Le texte qui va être dit par KITR
 * @param {method} mAction La fonction appelé par le bouton
 * @param {*} parametre Le premier paramètre passé à la fonction
 * @param {*} parametre2 Le deuxième paramètre passé à la fonction
 * @param {*} parametre3 Le troisième paramètre passé à la fonction
 */
function changerDestinationKitr(xFin, yFin, tempsAnim, aDialogue = [""], mAction = null, parametre = null, parametre2 = null, parametre3 = null) {
    oKitr.nKitrX.debut = oKitr.nKitrX.base;
    oKitr.nKitrY.debut = oKitr.nKitrY.base;
    oKitr.nKitrX.fin = xFin;
    oKitr.nKitrY.fin = yFin;
    oKitr.nKitrTempsBoucles = tempsAnim;
    oKitr.nKitrBougerTimer = 0;
    oKitr.aDialogue = aDialogue;
    aNouveauDialogue = [""];
    sAncienDialogue = "";
    nDialogueCharactere = 0;
    nDialogueDelai = 0;
    nDialogueLigne = 0;
    if (mAction != null) {
        mAction(parametre, parametre2, parametre3);
    }
}

/**
 * Actualise la position de KITR
 */
function bougerKitr() {
    //console.log(oKitr.nKitrX);
    oKitr.bEnMouvement = true;
    if (oKitr.nKitrBougerTimer >= oKitr.nKitrTempsBoucles) {
        oKitr.bEnMouvement = false;
        return; // Ignorer le reste de la fonction si on est déjà à la fin de l'animation
    }
    oKitr.nKitrBougerTimer++;
    oKitr.nKitrX.base = oKitr.nKitrX.debut + (oKitr.nKitrX.fin - oKitr.nKitrX.debut) * easeInOutQuint(oKitr.nKitrBougerTimer / oKitr.nKitrTempsBoucles);
    oKitr.nKitrY.base = oKitr.nKitrY.debut + (oKitr.nKitrY.fin - oKitr.nKitrY.debut) * easeInOutQuint(oKitr.nKitrBougerTimer / oKitr.nKitrTempsBoucles);
}

/**
 * Gère les dialogues de KITR
 */
function parlerKitr() {
    oCtx.save(); // Sauvegarde les valeurs actuelles du Ctx
    oCtx.font = "22px Outfit";
    oCtx.textBaseline = "middle";
    oCtx.textAlign = "center";
    nDialogueDelai--;
    if (nDialogueDelai <= 0) {
        // Passer de ligne si indiqué dans le string
        if (oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "§") {
            nDialogueCharactere = 0;
            nDialogueLigne++;
        }
        if (!aNouveauDialogue[nDialogueLigne]) {
            aNouveauDialogue[nDialogueLigne] = "";
        }
        // Ajouter ce qu'on veux si indiqué dans le string
        if (oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "¦") {
            aNouveauDialogue[nDialogueLigne] += oVariablesJeu.sNouvelleLettre.toLocaleUpperCase();
        }
        else {
            aNouveauDialogue[nDialogueLigne] += oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere);
        }
        // Jouer le son lié au code
        if (oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "•") {
            jouerSon(oAudBipCourt);
            oVariablesJeu.nIndicateurTimer = 6;
        }
        // Jouer le son lié au code
        if (oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "−") {
            jouerSon(oAudBipLong);
            oVariablesJeu.nIndicateurTimer = 18;
        }
        // Ajouter le charactère actuel dans le texte
        if (oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "." || oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "," || oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "!" || oKitr.aDialogue[nDialogueLigne].charAt(nDialogueCharactere) == "?") {
            nDialogueDelai = 12;
        } else {
            nDialogueDelai = 2;
        }
        nDialogueCharactere++;
    }
    if (aNouveauDialogue[0].toString() != "") {
        // La boite de dialogue
        oCtx.fillStyle = "#333333";
        oCtx.fillRect((pourcentageCanvas(0.5)) - 350, 25, 700, 200);
        oCtx.fillStyle = "#ffffff";
        oCtx.fillRect((pourcentageCanvas(0.5)) - 345, 30, 690, 190);
        oCtx.fillStyle = "#000000";

        // Le texte
        switch (nDialogueLigne) {
            case 0:
                oCtx.fillText(aNouveauDialogue[0], pourcentageCanvas(0.5), 130, 685);
                break;

            case 1:
                oCtx.fillText(aNouveauDialogue[0], pourcentageCanvas(0.5), 115, 685);
                oCtx.fillText(aNouveauDialogue[1], pourcentageCanvas(0.5), 145, 685);
                break;

            case 2:
                oCtx.fillText(aNouveauDialogue[0], pourcentageCanvas(0.5), 100, 685);
                oCtx.fillText(aNouveauDialogue[1], pourcentageCanvas(0.5), 130, 685);
                oCtx.fillText(aNouveauDialogue[2], pourcentageCanvas(0.5), 160, 685);
                break;

            case 3:
                oCtx.fillText(aNouveauDialogue[0], pourcentageCanvas(0.5), 85, 685);
                oCtx.fillText(aNouveauDialogue[1], pourcentageCanvas(0.5), 115, 685);
                oCtx.fillText(aNouveauDialogue[2], pourcentageCanvas(0.5), 145, 685);
                oCtx.fillText(aNouveauDialogue[3], pourcentageCanvas(0.5), 175, 685);
                break;

            default:
                oCtx.fillText(aNouveauDialogue[0], pourcentageCanvas(0.5), 85, 685);
                oCtx.fillText(aNouveauDialogue[1], pourcentageCanvas(0.5), 115, 685);
                oCtx.fillText(aNouveauDialogue[2], pourcentageCanvas(0.5), 145, 685);
                oCtx.fillText(aNouveauDialogue[3], pourcentageCanvas(0.5), 175, 685);
                break;
        }

        oKitr.bParle = true;
        if (aNouveauDialogue.toString() == oKitr.aDialogue.toString().replaceAll("§", "").replaceAll("¦", oVariablesJeu.sNouvelleLettre.toLocaleUpperCase())) {
            oKitr.bParle = false;

            if (bDialogueFlashBaisse) {
                nDialogueFlash -= 2;
            } else {
                nDialogueFlash += 2;
            }

            if (nDialogueFlash >= 180 || nDialogueFlash <= 50) {
                nDialogueFlash = Math.max(51, Math.min(nDialogueFlash, 179));
                bDialogueFlashBaisse = !bDialogueFlashBaisse;
            }

            oCtx.font = "11px Outfit";
            oCtx.textBaseline = "bottom";
            oCtx.textAlign = "right";

            oCtx.fillStyle = "rgb(0, 0, 0, " + (nDialogueFlash / 255) + ")";
            oCtx.fillText(oTextes[langue].sKitrPromptDialogue, pourcentageCanvas(0.5) + 340, 218);
        }
    } else {
        oKitr.bParle = false;
    }

    if (aNouveauDialogue.toString() != sAncienDialogue) {
        // Jouer un son pour accompagner le charactère
        let oAudioRandom = aAudSonsTexte[Math.floor(Math.random() * 6)];
        oAudioRandom.volume = 0.75;
        oAudioRandom.play();

        if (!oKitr.bEnMouvement) {
            oKitr.nKitrX.relatif = oKitr.nKitrX.base + (Math.floor(Math.random() * 7));
            oKitr.nKitrY.relatif = oKitr.nKitrY.base + (Math.floor(Math.random() * 7));
        }
    }

    sAncienDialogue = aNouveauDialogue.toString();
    oCtx.restore(); // Recharge la sauvegarde au début de la fonction
}

/**
 * Gère la lettre entrée en jeu
 * @param {string} sLettre La lettre entrée
 */
function lettreEntree(sLettre) {
    // Si on accepte la lettre en général, puis on a des conditions pour plusieurs cas
    if (oVariablesJeu.bAccepteTouches && !oKitr.bParle) {
        for (let i = 0; i < aLettres.length; i++) {
            let oLettre = aLettres[i];
            if (sLettre == oLettre.lettre.toLocaleLowerCase()) {
                jouerLettre(false, true, oLettre.code);
                return;
            }
        }
    }
}

/**
 * Joue la séquence de la lettre
 * @param {bool} bBouton Si l'appel de la fonction provient d'un bouton
 * @param {bool} bJoueur Si l'appel de la fonction provient de l'input du joueur
 * @param {string} sLettreCode Le code de la lettre
 */
function jouerLettre(bBouton = false, bJoueur = false, sLettreCode = null) {
    if (bBouton && !oVariablesJeu.bRejouerPermis) {
        return;
    }

    // Découpage du code en son
    let nTemps = 0;
    oVariablesJeu.bAccepteTouches = false;
    oVariablesJeu.bRejouerPermis = false;
    oVariablesJeu.bQuitterPermis = false;
    if (bJoueur) {
        oVariablesJeu.bInputJoueur = true;
    }

    if (sLettreCode == null) {
        for (let i = 0; i < oVariablesJeu.oLettreActuelle.code.length; i++) {
            if (oVariablesJeu.oLettreActuelle.code.charAt(i) == ".") {
                setTimeout(jouerSon, nTemps, oAudBipCourt);
                setTimeout(changerVariable, nTemps, "nIndicateurTimer", 6);
                nTemps += 200;
            } else {
                setTimeout(jouerSon, nTemps, oAudBipLong);
                setTimeout(changerVariable, nTemps, "nIndicateurTimer", 18);
                nTemps += 400;
            }
        }
    }
    else {
        for (let i = 0; i < sLettreCode.length; i++) {
            if (sLettreCode.charAt(i) == ".") {
                setTimeout(jouerSon, nTemps, oAudBipCourt);
                setTimeout(changerVariable, nTemps, "nIndicateurTimer", 6);
                nTemps += 200;
            } else {
                setTimeout(jouerSon, nTemps, oAudBipLong);
                setTimeout(changerVariable, nTemps, "nIndicateurTimer", 18);
                nTemps += 400;
            }
        }
    }

    if (sLettreCode == oVariablesJeu.oLettreActuelle.code) {
        setTimeout(lettreCorrecte, nTemps);
    }
    else {
        setTimeout(changerVariable, nTemps, "bAccepteTouches", true);
        setTimeout(changerVariable, nTemps, "bRejouerPermis", true);
        setTimeout(changerVariable, nTemps, "bQuitterPermis", true);
    }
    setTimeout(changerVariable, nTemps, "bInputJoueur", false);
}

/**
 * À appeller lorsque la bonne lettre est entrée
 */
function lettreCorrecte() {
    oVariablesJeu.bQuitterPermis = false;

    // Si le tutoriel n'est pas fini et qu'on est à sa 5e lettre
    if (oVariablesJeu.nTutorielLettres >= 4 && oVariablesJeu.bTutoriel) {
        oVariablesJeu.bAccepteTouches = false;
        oVariablesJeu.nLettresCorrectes++;
        setTimeout(changerVariable, 225, "bQuitterPermis", true);
        setTimeout(clavierPhysique, 225, { key: " " });
        creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 10, oTextes[langue].sKitrTutorielFin);
        creerPositionKitr(pourcentageCanvas(1.5), pourcentageCanvas(0.5, true), 40, "", finirTutoriel);
        return;
    }
    // Si c'est le tutoriel et que c'est la première lettre du tutoriel
    if (oVariablesJeu.bTutoriel && oVariablesJeu.nTutorielLettres == 0) {
        oVariablesJeu.nTutorielLettres++;
        oVariablesJeu.nLettresCorrectes++;
        oVariablesJeu.bAccepteTouches = false;
        nouvelleManche();
        setTimeout(changerVariable, 225, "bQuitterPermis", true);
        setTimeout(changerVariable, 225, "bAfficherProgres", true);
        setTimeout(clavierPhysique, 225, { key: " " });
        creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrTutorielEncore);
        creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, "", lettreSuivante);
        return;
    }
    // Si on est dans le tutoriel
    if (oVariablesJeu.bTutoriel) {
        oVariablesJeu.nTutorielLettres++;
        oVariablesJeu.nLettresCorrectes++;
        oVariablesJeu.bAccepteTouches = false;
        setTimeout(changerVariable, 225, "bQuitterPermis", true);
        setTimeout(clavierPhysique, 225, { key: " " });
        creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrTutorielEncore);
        creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, "", lettreSuivante);
        return;
    }
    // Si on introduit actuellement une nouvelle lettre
    if (oVariablesJeu.bNouvelleLettre) {
        oVariablesJeu.bNouvelleLettre = false;
        oVariablesJeu.bAccepteTouches = false;
        setTimeout(changerVariable, 275, "bQuitterPermis", true);
        setTimeout(clavierPhysique, 275, { key: " " });
        if (oVariablesJeu.bFin) {
            creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 20, oTextes[langue].sKitrNouvelleMancheFin01);
            creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrNouvelleMancheFin02);
            creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 10, oTextes[langue].sKitrNouvelleMancheFin03);
            creerPositionKitr(pourcentageCanvas(1.5), pourcentageCanvas(0.5, true), 40, "", lettreSuivante);
            return;
        }
        creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrNouvelleManche);
        creerPositionKitr(pourcentageCanvas(1.5), pourcentageCanvas(0.5, true), 40, "", lettreSuivante);
        return;
    }
    // Si le 'sac' est vide, sinon on fait juste prendre une nouvelle lettre
    if (aLettresSac.length <= 0) {
        oVariablesJeu.nLettresCorrectes++;
        oVariablesJeu.bAccepteTouches = false;
        if (oVariablesJeu.bFin) {
            oVariablesJeu.bAccepteTouches = true;
            nouvelleManche();
            lettreSuivante();
            return;
        }
        oVariablesJeu.bNouvelleLettre = true;
        if (aLettresBloquees.length <= 1 && !oVariablesJeu.bFin) {
            oVariablesJeu.bFin = true;
            introductionLettre(lettreHazard(true));
            setTimeout(changerVariable, 275, "bQuitterPermis", true);
            setTimeout(clavierPhysique, 275, { key: " " });
            return;
        }
        introductionLettre(lettreHazard(true));
        setTimeout(changerVariable, 275, "bQuitterPermis", true);
        setTimeout(clavierPhysique, 275, { key: " " });
        return;
    } else {
        oVariablesJeu.nLettresCorrectes++;
        lettreSuivante();
    }
}

/**
 * Passe à la lettre suivante
 * @param {string} sLettre La lettre qu'on souhaite demander au joueur
 * @param {string} sCode Le code morse de la lettre
 */
function lettreSuivante(sLettre = null, sCode) {
    let oLettre = { lettre: sLettre, code: sCode };
    oVariablesJeu.bQuitterPermis = false;

    if (sLettre != null) {
        oVariablesJeu.oLettreActuelle = oLettre;
        oVariablesJeu.bAccepteTouches = true;
    } else {
        oLettre = lettreHazard();
        oVariablesJeu.oLettreActuelle = oLettre;
    }
    setTimeout(changerVariable, 375, "bQuitterPermis", true);
    setTimeout(jouerLettre, 375);
}

/**
 * Démarre une nouvelle manche de lettres
 */
function nouvelleManche() {
    let aLettresManche = [];
    let aLettresDebloquees = [];

    for (let i = 0; i < 2; i++) {
        aLettresDebloquees = aLettres.slice();
        while (aLettresDebloquees.length > 0) {
            let j = Math.floor(Math.random() * aLettresDebloquees.length);
            aLettresManche[aLettresManche.length] = aLettresDebloquees[j];
            aLettresDebloquees.splice(j, 1);
        }
    }
    aLettresSac = aLettresManche;
    oVariablesJeu.nLettresMax = aLettresSac.length;
    oVariablesJeu.nLettresCorrectes = 0;
    if (bDebug) {
        console.log(aLettresSac);
    }
}

/**
 * Introduit une nouvelle lettre
 * @param {object} oLettre La lettre qu'on souhaite ajouter
 */
function introductionLettre(oLettre) {
    oVariablesJeu.bNouvelleLettre = true;
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 50, oTextes[langue].sKitrNouvelleLettre01);
    creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 1, oTextes[langue].sKitrNouvelleLettre02, ajouterLettre, oLettre.lettre);
    if (aLettresBloquees.length <= 1) {
        creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.4, true), 5, oTextes[langue].sKitrFin01);
        creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.4, true), 1, oTextes[langue].sKitrFin02);
        creerPositionKitr(pourcentageCanvas(0.5), pourcentageCanvas(0.5, true), 5, oTextes[langue].sKitrFin03);
    }
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 20, oTextes[langue].sKitrNouvelleLettre03, nouvelleManche);
    creerPositionKitr(pourcentageCanvas(0.8), pourcentageCanvas(0.5, true), 1, "", lettreSuivante, oLettre.lettre, oLettre.code);
}

/**
 * Retourne une lettre au hazard
 * @param {bool} bNouvelleLettre Si la lettre doit provenir des lettres pas encore ajoutées à la liste du joueur
 * @returns {object} Lettre choisie au hazard
 */
function lettreHazard(bNouvelleLettre = false) {
    let oLettre;
    if (bNouvelleLettre) {
        // Commence par trier les lettres par la longueur de leur code en morse
        let aLongueur1 = [];
        let aLongueur2 = [];
        let aLongueur3 = [];
        let aLongueur4 = [];
        for (let i = 0; i < aLettresBloquees.length; i++) {
            switch (aLettresBloquees[i].code.length) {
                case 1:
                    aLongueur1[aLongueur1.length] = aLettresBloquees[i];
                    break;
                case 2:
                    aLongueur2[aLongueur2.length] = aLettresBloquees[i];
                    break;
                case 3:
                    aLongueur3[aLongueur3.length] = aLettresBloquees[i];
                    break;
                case 4:
                    aLongueur4[aLongueur4.length] = aLettresBloquees[i];
                    break;

                default:
                    break;
            }
        }
        // On passe dans chaque groupe pour prendre dans la catégorie qui a au moins une lettre avec le code le plus court
        if (aLongueur4.length > 0) {
            oLettre = aLongueur4[Math.floor(Math.random() * aLongueur4.length)];
        }
        if (aLongueur3.length > 0) {
            oLettre = aLongueur3[Math.floor(Math.random() * aLongueur3.length)];
        }
        if (aLongueur2.length > 0) {
            oLettre = aLongueur2[Math.floor(Math.random() * aLongueur2.length)];
        }
        if (aLongueur1.length > 0) {
            oLettre = aLongueur1[Math.floor(Math.random() * aLongueur1.length)];
        }
    } else {
        let k = Math.floor(Math.random() * aLettresSac.length);
        oLettre = aLettresSac[k];
        aLettresSac.splice(k, 1);
    }
    return oLettre;
}

/**
 * Ajoute une lettre dans la logique du jeu
 * @param {string} lettre La lettre qu'on souhaite ajouter
 */
function ajouterLettre(lettre = "random") {
    if (aLettresBloquees.length != 0) {
        let lettreMinuscule = lettre.toLocaleLowerCase();
        let oLettre;
        if (lettreMinuscule == "random") {
            oLettre = lettreHazard(true);
        } else {
            for (let i = 0; i < aLettresBloquees.length; i++) {
                if (lettreMinuscule == aLettresBloquees[i].lettre) {
                    oLettre = aLettresBloquees[i];
                    break;
                }
            }
        }
        aLettres[aLettres.length] = oLettre;
        for (let i = 0; i < aLettresBloquees.length; i++) {
            if (oLettre == aLettresBloquees[i]) {
                aLettresBloquees.splice(i, 1);
                break;
            }
        }
        activerBouton(oLettre.lettre);
        oVariablesJeu.sNouvelleLettre = oLettre.lettre;
    }
}

/**
 * Crée un bouton pour rejouer la lettre actuelle
 */
function creerBoutonRejouer() {
    let nClavierX = (pourcentageCanvas(0.5)) - 25;
    let nClavierY = (nCanvasHauteur * 3) / 4;

    creerNouveauBouton(nClavierX - 420, nClavierY + 30, 120, 120, "", oTextes[langue].sJeuBoutonRejouer, true, false, jouerLettre, true, null, true);
}

/**
 * Crée un nouveau bouton.
 * @param {number} nPosX La position horizontale du bouton
 * @param {number} nPosY La position verticale du bouton
 * @param {number} nLargeur La largeur du bouton
 * @param {number} nHauteur La hauteur du bouton
 * @param {string} sTexte Le texte écrit sur le bouton
 * @param {string} sSousTitre Le texte écrit dans le bas du bouton
 * @param {bool} bActive Si le bouton est appuyable
 * @param {bool} bUsageUnique Si le bouton doit être supprimé après avoir été cliqué
 * @param {method} mAction La fonction appellé par le bouton
 * @param {*} parametre Le premier paramètre pour la fonction
 * @param {*} parametre2 Le deuxième paramètre pour la fonction
 * @param {bool} bClavier Si le bouton fait partie du clavier
 */
function creerNouveauBouton(nPosX = 0, nPosY = 0, nLargeur = 150, nHauteur = 50, sTexte = "Bouton", sSousTitre = "", bActive = true, bUsageUnique = false, mAction = null, parametre = null, parametre2 = null, bClavier = false) {
    let oNouveauBouton = {
        nX: nPosX,
        nY: nPosY,
        nLargeur: nLargeur,
        nHauteur: nHauteur,
        sTexte: sTexte,
        sSousTitre: sSousTitre,
        bActive: bActive,
        bUsageUnique: bUsageUnique,
        mAction: mAction,
        parametre: parametre,
        parametre2: parametre2,
        bClavier: bClavier
    };
    aBoutons[aBoutons.length] = oNouveauBouton;
}

/**
 * Active un bouton
 * @param {string} sNomBouton Le texte écrit sur le bouton
 */
function activerBouton(sNomBouton) {
    for (let i = 0; i < aBoutons.length; i++) {
        let oBouton = aBoutons[i];
        if (oBouton.sTexte.toLocaleLowerCase() == sNomBouton.toLocaleLowerCase()) {
            oBouton.bActive = true;
        }
    }
}

/**
 * Dessine tout les boutons sur le canvas.
 */
function afficherBoutons() {
    nAlpha = oCtx.globalAlpha;
    if (oVariablesJeu.sEtatJeu == "MenuPrincipal") {
        oCtx.globalAlpha = Math.max(0, ((nTitreTimer - 60) / 65));
    }

    let oBouton = {};
    for (let i = 0; i < aBoutons.length; i++) {
        oBouton = aBoutons[i];
        if (oBouton.sSousTitre.toLocaleLowerCase() != "quittermenu" && oVariablesJeu.bQuitter) {
            continue; // Skip le reste de la loop pour faire le bouton suivant
        }
        if (!oVariablesJeu.bAfficherClavier && oBouton.bClavier) {
            continue; // Skip le reste de la loop pour faire le bouton suivant
        }
        if (!oBouton.bActive) {
            dessinerBouton(oBouton.nX, oBouton.nY, oBouton.nLargeur, oBouton.nHauteur, "#555555", "#676767", "");
            continue; // Skip le reste de la loop pour faire le bouton suivant
        }
        oBouton.sBord = "#999999";
        oBouton.sFond = "#cccccc";
        if (oSouris.offsetX >= oBouton.nX && oSouris.offsetX <= oBouton.nX + oBouton.nLargeur && oSouris.offsetY >= oBouton.nY && oSouris.offsetY <= oBouton.nY + oBouton.nHauteur) {
            oBouton.sBord = "#777777";
            oBouton.sFond = "#aaaaaa";
        }

        let sTitre = oTextes[langue][oBouton.sTexte];
        if (sTitre == undefined) {
            sTitre = oBouton.sTexte;
        }
        let sSousTitre = oTextes[langue][oBouton.sSousTitre];
        if (sSousTitre == undefined) {
            sSousTitre = oBouton.sSousTitre;
        }
        dessinerBouton(oBouton.nX, oBouton.nY, oBouton.nLargeur, oBouton.nHauteur, oBouton.sBord, oBouton.sFond, sTitre, sSousTitre);
    }
    oCtx.globalAlpha = nAlpha;
}

/**
 * Dessine un bouton dans le canvas.
 * @param {number} nPosX La position horizontale du bouton
 * @param {number} nPosY La position verticale du bouton
 * @param {number} nLargeur La largeur du bouton
 * @param {number} nHauteur La hauteur du bouton
 * @param {string} sBord La couleur du bord
 * @param {string} sFond La couleur du fond
 * @param {string} sTexte Le texte écrit sur le bouton
 * @param {string} sSousTitre Le texte écrit dans le bas du bouton
 */
function dessinerBouton(nPosX, nPosY, nLargeur = 150, nHauteur = 50, sBord = "#999999", sFond = "#cccccc", sTexte = "Bouton", sSousTitre = "") {
    oCtx.save(); // Sauvegarde les valeurs actuelles du Ctx
    oCtx.beginPath();
    oCtx.fillStyle = sBord;
    oCtx.fillRect(nPosX, nPosY, nLargeur, nHauteur);
    oCtx.fillStyle = sFond;
    oCtx.fillRect(nPosX + 4, nPosY + 4, nLargeur - 8, nHauteur - 8);
    oCtx.fillStyle = "#000000";
    oCtx.font = "24px Outfit";
    oCtx.textBaseline = "middle";
    oCtx.textAlign = "center";
    oCtx.fillText(sTexte, nPosX + nLargeur / 2, nPosY + nHauteur / 2);
    oCtx.font = "18px Outfit";
    oCtx.textBaseline = "bottom";
    sSousTitre = sSousTitre.replaceAll(".", "•");
    sSousTitre = sSousTitre.replaceAll("-", "−");
    switch (sSousTitre.toLocaleLowerCase()) {
        case oTextes[langue].sJeuBoutonRejouer.toLocaleLowerCase():
            oCtx.drawImage(oImgRejouer, nPosX - 55 + nLargeur / 2, nPosY - 55 + nHauteur / 2, 110, 110);
            oCtx.font = "16px Outfit";
            oCtx.fillText(sSousTitre, nPosX + nLargeur / 2, nPosY + nHauteur + 18);
            break;
        case "quittermenu":
            oCtx.fillText("", -999, -999);
            break;
        case oTextes[langue].sJeuBoutonQuitter.toLocaleLowerCase():
            oCtx.drawImage(oImgQuitter, nPosX - 35 + nLargeur / 2, nPosY - 35 + nHauteur / 2, 70, 70);
            oCtx.font = "12px Outfit";
            oCtx.fillText(sSousTitre, nPosX + nLargeur / 2, nPosY + nHauteur + 13);
            break;
        case oTextes[langue].sLangue.toLocaleLowerCase():
            oCtx.drawImage(oImgLangues, nPosX - 25 + nLargeur / 2, nPosY - 25 + nHauteur / 2, 50, 50);
            oCtx.font = "12px Outfit";
            oCtx.fillText(sSousTitre, nPosX + nLargeur / 2, nPosY + nHauteur + 13);
            break;

        default:
            oCtx.fillText(sSousTitre, nPosX + nLargeur / 2, nPosY + nHauteur + 2);
            break;
    }
    oCtx.closePath();
    oCtx.restore(); // Recharge la sauvegarde au début de la fonction
}

/**
 * Ajoute un indicateur visuel représentant le code morse
 */
function afficherIndicateur() {
    oCtx.save(); // Sauvegarde les valeurs actuelles du Ctx
    oVariablesJeu.nIndicateurTimer--;
    if (oVariablesJeu.nIndicateurTimer > 0) {
        oCtx.beginPath();
        oCtx.fillStyle = "#ff0000";
        if (oVariablesJeu.bInputJoueur) {
            oCtx.fillStyle = "#2288ff";
        }
        oCtx.fillRect(pourcentageCanvas(0.5) - 75, pourcentageCanvas(0.5, true) - 75, 150, 150);
        oCtx.closePath();
    }
    oCtx.restore(); // Recharge la sauvegarde au début de la fonction
}

/**
 * Raccourci clearRect() sur l'entièreté du canvas
 */
function viderCanvas() {
    oCtx.clearRect(0, 0, nCanvasLargeur, nCanvasHauteur);
}

/**
 * Change la valeur d'une variable de jeu
 * @param {string} sVariableChange La variable à changer
 * @param {*} nouvelleValeur La valeur à attribuer
 */
function changerVariable(sVariableChange, nouvelleValeur) {
    oVariablesJeu[sVariableChange] = nouvelleValeur;
}

/**
 * Retourne une position dans le canvas basé sur un pourcentage
 * @param {number} nPourcentage Le pourcentage dans le canvas
 * @param {bool} bVertical Si vertical (défaut: horizontal) 
 * @returns {number} Position dans le canvas
 */
function pourcentageCanvas(nPourcentage = 0.5, bVertical = false) {
    let nPos;
    if (bVertical) {
        nPos = nPourcentage * nCanvasHauteur;
    } else {
        nPos = nPourcentage * nCanvasLargeur;
    }
    return nPos;
}

/**
 * Passe à la langue suivante
 */
function changerLangue() {
    switch (langue) {
        case "fr":
            langue = "en";
            break;
        case "en":
            langue = "fr";
            break;

        default:
            break;
    }
}

/**
 * Joue un son
 * @param {HTMLAudioElement} oSon Le son à jouer
 */
function jouerSon(oSon) {
    oSon.play();
}

/**
 * Code venant de "https://easings.net/#easeInOutQuint" : courbe de bézier pour bouger de manière fluide
 * @param {*} x 
 * @returns number
 */
function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

/**
 * Génère les boutons qui forment le clavier
 */
function creerClavier() {
    let nClavierX = (pourcentageCanvas(0.5)) - 25;
    let nClavierY = (nCanvasHauteur * 3) / 4;
    oVariablesJeu.bAfficherClavier = true

    // QWERTYUIOP - Première ligne
    creerNouveauBouton(nClavierX - 270, nClavierY, 50, 50, "Q", "--.-", false, false, lettreEntree, "q", null, true);
    creerNouveauBouton(nClavierX - 210, nClavierY, 50, 50, "W", ".--", false, false, lettreEntree, "w", null, true);
    creerNouveauBouton(nClavierX - 150, nClavierY, 50, 50, "E", ".", false, false, lettreEntree, "e", null, true);
    creerNouveauBouton(nClavierX - 90, nClavierY, 50, 50, "R", ".-.", false, false, lettreEntree, "r", null, true);
    creerNouveauBouton(nClavierX - 30, nClavierY, 50, 50, "T", "-", false, false, lettreEntree, "t", null, true);
    creerNouveauBouton(nClavierX + 30, nClavierY, 50, 50, "Y", "-.--", false, false, lettreEntree, "y", null, true);
    creerNouveauBouton(nClavierX + 90, nClavierY, 50, 50, "U", "..-", false, false, lettreEntree, "u", null, true);
    creerNouveauBouton(nClavierX + 150, nClavierY, 50, 50, "I", "..", false, false, lettreEntree, "i", null, true);
    creerNouveauBouton(nClavierX + 210, nClavierY, 50, 50, "O", "---", false, false, lettreEntree, "o", null, true);
    creerNouveauBouton(nClavierX + 270, nClavierY, 50, 50, "P", ".--.", false, false, lettreEntree, "p", null, true);

    // ASDFGHJKL - Deuxième ligne
    creerNouveauBouton(nClavierX - 240, nClavierY + 60, 50, 50, "A", ".-", false, false, lettreEntree, "a", null, true);
    creerNouveauBouton(nClavierX - 180, nClavierY + 60, 50, 50, "S", "...", false, false, lettreEntree, "s", null, true);
    creerNouveauBouton(nClavierX - 120, nClavierY + 60, 50, 50, "D", "-..", false, false, lettreEntree, "d", null, true);
    creerNouveauBouton(nClavierX - 60, nClavierY + 60, 50, 50, "F", "..-.", false, false, lettreEntree, "f", null, true);
    creerNouveauBouton(nClavierX, nClavierY + 60, 50, 50, "G", "--.", false, false, lettreEntree, "g", null, true);
    creerNouveauBouton(nClavierX + 60, nClavierY + 60, 50, 50, "H", "....", false, false, lettreEntree, "h", null, true);
    creerNouveauBouton(nClavierX + 120, nClavierY + 60, 50, 50, "J", ".---", false, false, lettreEntree, "j", null, true);
    creerNouveauBouton(nClavierX + 180, nClavierY + 60, 50, 50, "K", "-.-", false, false, lettreEntree, "k", null, true);
    creerNouveauBouton(nClavierX + 240, nClavierY + 60, 50, 50, "L", ".-..", false, false, lettreEntree, "l", null, true);

    // ZXCVBNM - Troisième ligne
    creerNouveauBouton(nClavierX - 180, nClavierY + 120, 50, 50, "Z", "--..", false, false, lettreEntree, "z", null, true);
    creerNouveauBouton(nClavierX - 120, nClavierY + 120, 50, 50, "X", "-..-", false, false, lettreEntree, "x", null, true);
    creerNouveauBouton(nClavierX - 60, nClavierY + 120, 50, 50, "C", "-.-.", false, false, lettreEntree, "c", null, true);
    creerNouveauBouton(nClavierX, nClavierY + 120, 50, 50, "V", "...-", false, false, lettreEntree, "v", null, true);
    creerNouveauBouton(nClavierX + 60, nClavierY + 120, 50, 50, "B", "-...", false, false, lettreEntree, "b", null, true);
    creerNouveauBouton(nClavierX + 120, nClavierY + 120, 50, 50, "N", "-.", false, false, lettreEntree, "n", null, true);
    creerNouveauBouton(nClavierX + 180, nClavierY + 120, 50, 50, "M", "--", false, false, lettreEntree, "m", null, true);

    if (bDebug) {
        creerNouveauBouton(nClavierX + 410, nClavierY + 25, 220, 50, oTextes[langue].sDebugAjouter, "", true, false, ajouterLettre, "random", null, true);
        creerNouveauBouton(nClavierX + 410, nClavierY + 85, 220, 50, oTextes[langue].sDebugSkip, "", true, false, lettreSuivante, null, null, true);
    }
}

/**
 * Retourne au menu principal et restore certaines données
 */
function retourMenu() {
    sAncienDialogue = "";
    aNouveauDialogue = [""];
    nDialogueCharactere = 0;
    nDialogueDelai = 0;
    nDialogueLigne = 0;
    nDialogueFlash = 200;
    bDialogueFlashBaisse = false;
    oVariablesJeu = {
        bQuitter: false,
        bQuitterPermis: false,
        bTutoriel: true,
        bFin: false,
        nTutorielLettres: 0,
        sEtatJeu: "MenuPrincipal",
        bAfficherClavier: false,
        bAccepteTouches: false,
        bKitrActive: false,
        sNouvelleLettre: "LETTRE PAR DÉFAUT",
        bNouvelleLettre: false,
        oLettreActuelle: { lettre: "e", code: "." },
        nIndicateurTimer: 0,
        bRejouerPermis: false
    };
    nTitreTimer = 0;
    aBoutons = [];
    oKitr = {
        aKitrPositions: [],
        nKitrEtapePosition: 0,
        nKitrX: {
            base: 0 - (pourcentageCanvas(0.5)),
            debut: 0,
            fin: 0,
            relatif: 0
        },
        nKitrY: {
            base: (nCanvasHauteur / 2) - 128,
            debut: 0,
            fin: 0,
            relatif: 0
        },
        nKitrBougerTimer: 0,
        nKitrTempsBoucles: 0,
        aDialogue: [""],
        bParle: false,
        bEnMouvement: false
    };
    oKitr.nKitrX.debut = oKitr.nKitrX.base;
    oKitr.nKitrY.debut = oKitr.nKitrY.base;
    oKitr.nKitrX.fin = oKitr.nKitrX.base;
    oKitr.nKitrY.fin = oKitr.nKitrY.base;
    oKitr.nKitrX.relatif = oKitr.nKitrX.base;
    oKitr.nKitrY.relatif = oKitr.nKitrY.base;
    aLettresSac = [];
    aLettres = [];
    aLettresBloquees = [
        { lettre: "a", code: ".-" },
        { lettre: "b", code: "-..." },
        { lettre: "c", code: "-.-." },
        { lettre: "d", code: "-.." },
        { lettre: "e", code: "." },
        { lettre: "f", code: "..-." },
        { lettre: "g", code: "--." },
        { lettre: "h", code: "...." },
        { lettre: "i", code: ".." },
        { lettre: "j", code: ".---" },
        { lettre: "k", code: "-.-" },
        { lettre: "l", code: ".-.." },
        { lettre: "m", code: "--" },
        { lettre: "n", code: "-." },
        { lettre: "o", code: "---" },
        { lettre: "p", code: ".--." },
        { lettre: "q", code: "--.-" },
        { lettre: "r", code: ".-." },
        { lettre: "s", code: "..." },
        { lettre: "t", code: "-" },
        { lettre: "u", code: "..-" },
        { lettre: "v", code: "...-" },
        { lettre: "w", code: ".--" },
        { lettre: "x", code: "-..-" },
        { lettre: "y", code: "-.--" },
        { lettre: "z", code: "--.." },
    ];

    creerNouveauBouton(pourcentageCanvas(0.5) + 30, pourcentageCanvas(0.5, true) - 75, 300, 100, "sMenuPrincipalBoutonJouer", "", true, true, demarrerJeu);
    creerNouveauBouton(pourcentageCanvas(1) - 92, 30, 62, 62, "", "sLangue", true, false, changerLangue);
}
