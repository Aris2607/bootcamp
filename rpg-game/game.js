// const inquirer = require("inquirer");
import inquirer from "inquirer";
// const Player = require("./player");
import Player from "./player.js";
// const Enemy = require("./enemy");
import enemies from "./enemy.js";

class Game {
  constructor() {
    this.player = null;
    this.currentEnemyIndex = 0;
    this.arc = 1;
  }

  async start() {
    const { name } = await inquirer.prompt({
      name: "name",
      type: "input",
      message: "Masukkan nama karakter Anda:",
    });

    this.player = new Player(name);
    this.currentEnemy = enemies[this.currentEnemyIndex];

    this.gameLoop();
  }

  async gameLoop() {
    while (this.player.health > 0) {
      if (this.currentEnemy.health <= 0) {
        console.log(`Anda telah mengalahkan ${this.currentEnemy.name}!`);
        this.player.gainExp(20); // Menambahkan EXP setiap kali musuh dikalahkan
        this.currentEnemyIndex++;
        this.givePotion();

        if (this.currentEnemyIndex >= enemies.length) {
          console.log(`Anda telah menyelesaikan arc ${this.arc}!`);
          this.arc++;
          this.currentEnemyIndex = 0;
        }
        this.currentEnemy = enemies[this.currentEnemyIndex];
        console.log(`Musuh baru muncul: ${this.currentEnemy.name}`);
      }

      console.log(`\n${this.player.name}: ${this.player.health} HP`);
      console.log(`${this.currentEnemy.name}: ${this.currentEnemy.health} HP`);
      console.log(`Potion tersisa: ${this.player.inventory.potions}`);
      console.log(
        `Level: ${this.player.level}, EXP: ${this.player.exp}/${this.player.expToNextLevel}`
      );

      const { action } = await inquirer.prompt({
        name: "action",
        type: "list",
        message: "Pilih aksi:",
        choices: ["Serang", "Gunakan Potion", "Keluar"],
      });

      if (action === "Serang") {
        this.player.attack(this.currentEnemy);
        if (this.currentEnemy.health > 0) {
          this.currentEnemy.attack(this.player);
        }
      } else if (action === "Gunakan Potion") {
        this.player.usePotion();
        if (this.currentEnemy.health > 0) {
          this.currentEnemy.attack(this.player);
        }
      } else {
        console.log("Keluar dari game...");
        break;
      }
    }

    if (this.player.health <= 0) {
      console.log("Anda kalah!");
    }
  }

  givePotion() {
    const chance = Math.random();
    if (chance < 0.5) {
      this.player.inventory.potions++;
      console.log("Anda mendapatkan potion!");
    }
  }
}

export default Game;
