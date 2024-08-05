class Enemy {
  constructor(name, health, attackPower) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
  }

  attack(player) {
    console.log(
      `${this.name} menyerang ${player.name} dengan kekuatan ${this.attackPower}`
    );
    player.health -= this.attackPower;
  }
}

const enemies = [
  new Enemy("Goblin", 50, 5),
  new Enemy("Orc", 80, 10),
  new Enemy("Dragon", 120, 15),
];

export default enemies;
