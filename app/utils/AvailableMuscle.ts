import ImageAbdos from "~/images/image-abdos.jpg";
import ImageAvantBras from "~/images/image-avant-bras.jpg";
import ImageBiceps from "~/images/image-biceps.jpg";
import ImageDorsaux from "~/images/image-dorsaux.jpg";
import ImageDeltoide from "~/images/image-deltoide.jpg";
import ImageFessier from "~/images/image-fessier.jpg";
import ImageIschioJambier from "~/images/image-ischio-jambier.jpg";
import ImageLombaire from "~/images/image-lombaire.jpg";
import ImageMollet from "~/images/image-mollet.jpg";
import ImagePectoraux from "~/images/image-pectoraux.jpg";
import ImageQuadriceps from "~/images/image-quadriceps.jpg";
import ImageTrapeze from "~/images/image-trapeze.jpg";
import ImageTriceps from "~/images/image-triceps.jpg";
import { CATEGORIE } from "~/utils/Categorie"

export const AVAILABLE_MUSCLE: { [key in CATEGORIE]: string } = {
  [CATEGORIE.ABDOMINAUX]: ImageAbdos,
  [CATEGORIE.AVANTBRAS]: ImageAvantBras,
  [CATEGORIE.BICEPS]: ImageBiceps,
  [CATEGORIE.DORSAUX]: ImageDorsaux,
  [CATEGORIE.DELTOIDE]: ImageDeltoide,
  [CATEGORIE.FESSIERS]: ImageFessier,
  [CATEGORIE.ISCHIOJAMBIERS]: ImageIschioJambier,
  [CATEGORIE.LOMBAIRES]: ImageLombaire,
  [CATEGORIE.MOLLETS]: ImageMollet,
  [CATEGORIE.PECTORAUX]: ImagePectoraux,
  [CATEGORIE.QUADRICEPS]: ImageQuadriceps,
  [CATEGORIE.TRAPÈZES]: ImageTrapeze,
  [CATEGORIE.TRICEPS]: ImageTriceps,
};
