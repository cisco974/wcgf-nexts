<div class="leagues-section-presentation">
	<div class="home-block">
		<div class="game-content">
			<div class="game-icon-tarot game-icon-tarot-presentation">
				<img src="./img/store/icon-tarot.jpg" alt="Tarot Icon">
			</div>
			<img src="./img/bg-table.jpg" alt="WCGF Game" class="game-image-players">
			<div class="game-icon-presentation game-icon-players-presentation">
				<img src="img/avatars/1.png" alt="Avatar">
			</div>
		</div>
	</div>
</div>
	
<div class="leagues-section">
	<div class="home-block">
		<div class="selector league-dropdown-bar">
			<select id="select-period">
				<option value="1">Week</option>
				<option value="2">Month</option>
				<option value="3">Year</option>
			</select>
			<button class="blue-button">OK</button>
		</div>
		<h3 style="text-align: center">ProGamerX</h3>
		<h4 style="text-align: center">XP / LEAGUES / COINS</h4>
		<canvas id="combinedGraph1" style="width: 100%; height: 300px;"></canvas>
		<span class="experience">5000</span>
		<span class="points">7565</span>
		<span class="rewards">25000</span>
	</div>
	<div class="home-block">
		<div class="selector league-dropdown-bar">
			<select id="select-period">
				<option value="1">Week</option>
				<option value="2">Month</option>
				<option value="3">Year</option>
			</select>
			<button class="blue-button">OK</button>
		</div>
		<h3 style="text-align: center">ProGamerX</h3>
		<h4 style="text-align: center">WINS / LOSSES</h4>
		<canvas id="winLossGraph1" style="width: 100%; height: 300px;"></canvas>
		<span class="wins">75</span><span class="losses">30</span>
	</div>
	<div class="home-block">
		<div class="selector league-dropdown-bar">
			<select id="select-period">
				<option value="1">Week</option>
				<option value="2">Month</option>
				<option value="3">Year</option>
			</select>
			<button class="blue-button">OK</button>
		</div>
		<h3 style="text-align: center">ProGamerX</h3>
		<h4 style="text-align: center">LAST 3 GAMES SERIE</h4>
		<?php include("table-tarot-games.php"); ?>
	</div>
</div>