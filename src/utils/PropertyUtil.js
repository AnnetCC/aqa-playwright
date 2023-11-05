export default class PropertyUtil {

    static updateProperties(sourceData, targetData) {
        let returnedObject = Object.assign({}, sourceData);

        for (const key of Object.keys(targetData)) {
            returnedObject[key] = targetData[key];
        }
        return returnedObject;
    }
}
