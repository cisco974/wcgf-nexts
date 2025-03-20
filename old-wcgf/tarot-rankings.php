<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Tarot - Rankings | WCGF</title>
    
	<?php include("head.php"); ?>
	
</head>
<body>
	
	<?php include("top.php"); ?>
	
    <?php include("header.php"); ?>
	
	<?php include("tarot-header.php"); ?>


    <div class="container">
        <?php include("tarot-rankings-intro.php"); ?>
				
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
			<div class="league-header">
				<div class="logo-container">
					<img src="img/avatars/5.png" alt="Avatar" class="logo-avatar-table">
					<img src="img/avatars/4.png" alt="Avatar" class="logo-avatar-table-2">
					<img src="img/avatars/2.png" alt="Avatar" class="logo-avatar-table-2">
				</div>
				<h3>LEAGUES RANKING</h3>
			</div>
			<?php include("table-tarot-rankings-leagues.php"); ?>
			<div class="selector search-bar" style="margin-top: 20px">
				<input type="text" id="search-player" placeholder="USERNAME OR ID"> <button class="blue-button"> OK </button>
			</div>
			<div class="selector" style="margin-top: 20px">
				<button class="blue-button"> PREVIOUS </button> <button class="blue-button"> NEXT </button>
			</div>
				<h3>TOP 3</h3>
			<canvas id="leagueProgressGraph" style="width: 100%; height: 300px;"></canvas>
		</div>
		<div class="home-block">
			<div class="selector league-dropdown-bar" style="padding-bottom: 20px">
				<select id="select-period">
					<option value="1">Week</option>
					<option value="2">Month</option>
					<option value="3">Year</option>
				</select>
				<button class="blue-button">OK</button>
			</div>
			<div class="league-header">
				<div class="logo-container">
					<img src="img/avatars/2.png" alt="Avatar" class="logo-avatar-table">
					<img src="img/avatars/1.png" alt="Avatar" class="logo-avatar-table-2">
					<img src="img/avatars/3.png" alt="Avatar" class="logo-avatar-table-2">
				</div>
				<h3>EXPERIENCE RANKING</h3>
			</div>
			<?php include("table-tarot-rankings-leagues.php"); ?>
			<div class="selector search-bar" style="margin-top: 20px">
				<input type="text" id="search-player" placeholder="USERNAME OR ID"> <button class="blue-button"> OK </button>
			</div>
			<div class="selector" style="margin-top: 20px">
				<button class="blue-button"> PREVIOUS </button> <button class="blue-button"> NEXT </button>
			</div>
				<h3>TOP 3</h3>
			<canvas id="xpProgressGraph" style="width: 100%; height: 300px;"></canvas>
		</div>
		<div class="home-block">
			<div class="selector league-dropdown-bar" style="padding-bottom: 20px">
				<select id="select-period">
					<option value="1">Week</option>
					<option value="2">Month</option>
					<option value="3">Year</option>
				</select>
				<button class="blue-button">OK</button>
			</div>
			<div class="league-header">
				<div class="logo-container">
					<img src="img/avatars/4.png" alt="Avatar" class="logo-avatar-table">
					<img src="img/avatars/3.png" alt="Avatar" class="logo-avatar-table-2">
					<img src="img/avatars/1.png" alt="Avatar" class="logo-avatar-table-2">
				</div>
				<h3>COINS RANKING</h3>
			</div>
			<?php include("table-tarot-rankings-leagues.php"); ?>
			<div class="selector search-bar" style="margin-top: 20px">
				<input type="text" id="search-player" placeholder="USERNAME OR ID"> <button class="blue-button"> OK </button>
			</div>
			<div class="selector" style="margin-top: 20px">
				<button class="blue-button"> PREVIOUS </button> <button class="blue-button"> NEXT </button>
			</div>
				<h3>TOP 3</h3>
			<canvas id="coinProgressGraph" style="width: 100%; height: 300px;"></canvas>
		</div>
	</div>

		
		<?php include("tarot-rankings-outro.php"); ?>
				
		<?php include("more-games.php"); ?>
    </div>

    <?php include("footer.php"); ?>
	
	<?php include("script.php"); ?>

</body>
</html>

