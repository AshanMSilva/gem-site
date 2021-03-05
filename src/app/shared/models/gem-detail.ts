export class GemDetail {
    // firebase
    sgtlReportNumber: string;
    date: string;

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
    gemImageURL: string;

    cardQRCodeImageURL: string;
    reportQRCodeImageURL: string;

    //Latest Card,Report Ids filter by sgtlReportNo and latest revision
    latestCardId: string
    latestReportId: string
}
