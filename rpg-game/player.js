class Player {
  constructor(name) {
    this.name = name;
    this.health = 100;
    this.attackPower = 10;
    this.level = 1;
    this.exp = 0;
    this.expToNextLevel = 50;
    this.inventory = {
      potions: 0,
    };
  }

  attack(enemy) {
    console.log(
      `${this.name} menyerang ${enemy.name} dengan kekuatan ${this.attackPower}`
    );
    enemy.health -= this.attackPower;
  }

  usePotion() {
    if (this.inventory.potions > 0) {
      this.health += 120;
      this.inventory.potions--;
      console.log(
        `${this.name} menggunakan potion. HP meningkat menjadi ${this.health}. Potion tersisa: ${this.inventory.potions}`
      );
    } else {
      console.log(`Tidak ada potion yang tersisa!`);
    }
  }

  gainExp(amount) {
    this.exp += amount;
    console.log(
      `${this.name} mendapatkan ${amount} EXP. Total EXP: ${this.exp}/${this.expToNextLevel}`
    );
    if (this.exp >= this.expToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.exp = this.exp - this.expToNextLevel;
    this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
    this.health += 20;
    this.attackPower += 5;
    console.log(
      `${this.name} naik ke level ${this.level}! Kesehatan meningkat menjadi ${this.health}, kekuatan serangan meningkat menjadi ${this.attackPower}`
    );
  }
}

export default Player;
