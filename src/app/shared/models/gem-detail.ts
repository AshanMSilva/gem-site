import { ISSUETYPE } from "../utils/gem-details-types";

export class GemDetail {
    // firebase
    sgtlReportNumber: string;
    date: string;
    issueType: ISSUETYPE;

    isReportGenerated: boolean
    isCardGenerated: boolean

    object: string;

    //Details of specimen
    weight: string;
    shapeAndCut: string;
    transparency: string;
    dimensions: string;

    //Tested data
    refractiveIndex: string;
    specificGravity: string;
    hardness: string;
    opticCharacter: string;
    magnification: string;

    color: string;
    species: string;
    variety: string;
    comments: string;
    apex: string;

    //Gem Image
    isGemImageSaved: boolean;

    gemologistName: string
}
