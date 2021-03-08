import { DatePipe } from "@angular/common";
import { GemDetail } from "./gem-detail";

export class ReportContext {
    sgtlReportNumber: string;
    date: string;

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

    gemologistName: string

    constructor(gemDetail: GemDetail) {
        let pipe = new DatePipe('en-US'); // Use your own locale
        this.date = pipe.transform(gemDetail.date, "dd/MM/yy")
        this.sgtlReportNumber = gemDetail.sgtlReportNumber
        this.object = gemDetail.object

        //Details of specimen
        this.weight = gemDetail.weight
        this.shapeAndCut = gemDetail.shapeAndCut
        this.transparency = gemDetail.transparency
        this.dimensions = gemDetail.dimensions

        //Tested data
        this.refractiveIndex = gemDetail.refractiveIndex
        this.specificGravity = gemDetail.specificGravity
        this.hardness = gemDetail.hardness
        this.opticCharacter = gemDetail.opticCharacter
        this.magnification = gemDetail.magnification

        this.color = gemDetail.color
        this.species = gemDetail.species
        this.variety = gemDetail.variety
        this.comments = gemDetail.comments
        this.apex = gemDetail.apex

        this.gemologistName = gemDetail.gemologistName

    }

    getBasicDetialsMap(): Map<string, string> {
        let details = new Map<string, string>();
        details.set("SGTL Report No.", this.sgtlReportNumber);
        details.set("Date", this.date);
        details.set("Object", this.object);
        return details
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
        testData.set("Specific Gravity", this.specificGravity)
        testData.set("Hardness", this.hardness)
        testData.set("Optic Character", this.opticCharacter)
        testData.set("Magnification", this.magnification)
        testData.set("Color", this.color)
        return testData
    }
}
export class CardContext {
    sgtlReportNumber: string;
    date: string;

    weight: string;
    shapeAndCut: string;
    dimensions: string;

    color: string;
    species: string;
    variety: string;
    comments: string;

    gemologistName: string


    constructor(gemDetail: GemDetail) {
        let pipe = new DatePipe('en-US'); // Use your own locale
        this.date = pipe.transform(gemDetail.date, "dd/MM/yy")
        this.sgtlReportNumber = gemDetail.sgtlReportNumber

        this.weight = gemDetail.weight
        this.shapeAndCut = gemDetail.shapeAndCut
        this.dimensions = gemDetail.dimensions

        this.color = gemDetail.color
        this.species = gemDetail.species
        this.variety = gemDetail.variety
        this.comments = gemDetail.comments

        this.gemologistName = gemDetail.gemologistName
    }

    getBasicDetialsMap(): Map<string, string> {
        let details = new Map<string, string>();
        details.set("Date", this.date);
        details.set("SGTL Report No.", this.sgtlReportNumber);
        return details
    }

    getDetailsOfSpecimenMap(): Map<string, string> {
        let details = new Map<string, string>();
        details.set("Shape And Cut", this.shapeAndCut);
        details.set("Weight", this.weight);
        details.set("Dimensions", this.dimensions);
        details.set("Color", this.color)
        details.set("Species", this.species)
        details.set("Variety", this.variety)
        details.set("comments", this.comments)
        return details
    }
    getAllDetailsMap(): Map<string, string> {
        let details = new Map<string, string>();
        details.set("Date", this.date);
        details.set("SGTL Report No.", this.sgtlReportNumber);
        details.set("Shape And Cut", this.shapeAndCut);
        details.set("Weight", this.weight);
        details.set("Dimensions", this.dimensions);
        details.set("Color", this.color)
        details.set("Species", this.species)
        details.set("Variety", this.variety)
        details.set("comments", this.comments)
        return details
    }
}