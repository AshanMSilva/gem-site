export class GemDetail {
    // firebase
    detailId: string

    date: string;
    sgtlReportNumber: string;

    //Details of specimen
    weight: string;
    shapeAndCut: string;
    transparency: string;
    dimensions: string;

    //Tested data
    refractiveIndex: string;
    specifyGravity: string;
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

    //LatestLink for QR
    qrCodePdfLinkCard: string;
    qrCodeImageURLCard: string;

    qrCodePdfLinkReport: string;
    qrCodeImageURLReport: string;

    //Latest Card,Report Ids filter by sgtlReportNo and latest revision
    latestCardId: string
    latestReportId: string
}

export class ReportContext {
    // firebase
    reportId: string

    date: string;
    sgtlReportNumber: string;

    //Details of specimen
    weight: string;
    shapeAndCut: string;
    transparency: string;
    dimensions: string;

    //Tested data
    refractiveIndex: string;
    specifyGravity: string;
    hardness: string;
    opticCharacter: string;
    magnification: string;

    color: string;
    species: string;
    variety: string;
    comments: string;
    apex: string;

    //Not in report as text
    gemImageURL: string;
    
    //LatestLink for QR
    qrCodePdfLinkReport: string;
    qrCodeImageURLReport: string;

    revision: number;


    constructor(gemDetail: GemDetail) {

        this.date = gemDetail.date
        this.sgtlReportNumber = gemDetail.sgtlReportNumber

        //Details of specimen
        this.weight = gemDetail.weight
        this.shapeAndCut = gemDetail.shapeAndCut
        this.transparency = gemDetail.transparency
        this.dimensions = gemDetail.dimensions

        //Tested data
        this.refractiveIndex = gemDetail.refractiveIndex
        this.specifyGravity = gemDetail.specifyGravity
        this.hardness = gemDetail.hardness
        this.opticCharacter = gemDetail.opticCharacter
        this.magnification = gemDetail.magnification

        this.color = gemDetail.color
        this.species = gemDetail.species
        this.variety = gemDetail.variety
        this.comments = gemDetail.comments
        this.apex = gemDetail.apex
    }

    getDetailsOfSpecimenMap(): Map<string, string> {
        let details = new Map<string, string>();
        details.set("Weight", this.weight);
        details.set("Shape And Cut", this.shapeAndCut);
        details.set("Transparency", this.transparency);
        details.set("Dimensions", this.dimensions);
        return details
    }

    getTestedDataMap(): Map<string, string> {
        let testData = new Map<string, string>()

        testData.set("Refractive Index", this.refractiveIndex)
        testData.set("Specific Gravity", this.specifyGravity)
        testData.set("Hardness", this.hardness)
        testData.set("Optic Character", this.opticCharacter)
        testData.set("Magnification", this.magnification)
        return testData
    }
}
export class CardContext {
    //firebase
    cardId: string;

    date: string;
    sgtlReportNumber: string;

    weight: string;
    shapeAndCut: string;
    dimensions: string;

    color: string;
    species: string;
    variety: string;
    comments: string;

    //Not in report text
    gemImageURL: string;

    //LatestLink for QR
    qrCodePdfLinkCard: string;
    qrCodeImageURLCard: string;

    revision: number;

    constructor(gemDetail: GemDetail) {
        this.date = gemDetail.date
        this.sgtlReportNumber = gemDetail.sgtlReportNumber

        this.weight = gemDetail.weight
        this.shapeAndCut = gemDetail.shapeAndCut
        this.dimensions = gemDetail.dimensions

        this.color = gemDetail.color
        this.species = gemDetail.species
        this.variety = gemDetail.variety
        this.comments = gemDetail.comments
    }
}