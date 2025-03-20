<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>World Card Games Federation</title>
    
	<?php include("head.php"); ?>
	
</head>
<body>
	
	<?php include("top.php"); ?>
	
    <?php include("header.php"); ?>
	
	<div class="page-header-home">
		<h1>WORLD CARD GAMES FEDERATION</h1>
		<p class="page-header-home-text">
			Welcome to WCGF.com, our Hub for Competitive Card Games<br>
			Discover leagues, tournaments and rankings
		</p>
		<div><?php include("events.php"); ?></div>
	</div>


    <div class="container">
        <?php include("home-intro.php"); ?>
		
		<?php include("home-outro.php"); ?>
				
    </div>

    <?php include("footer.php"); ?>
	
	<?php include("script.php"); ?>

</body>
</html>

