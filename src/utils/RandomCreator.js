export default class RandomCreator {
  static generateEmail () {
    return "aqa-" + (Math.random() + 1).toString(36).substring(7) + "@gmail.com"
  }

  static generatePassword () {
    return "Aqa3_" + Math.random().toString(36).substring(7)
  }
}
