<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Tarot - Leagues | WCGF</title>
    
	<?php include("head.php"); ?>
	
</head>
<body>
	
	<?php include("top.php"); ?>
	
    <?php include("header.php"); ?>
	
	<?php include("tarot-header.php"); ?>


    <div class="container">
        <?php include("tarot-leagues-intro.php"); ?>

		<div class="content-with-sidebar">
			<!-- Contenu principal -->
			<div class="main-content">
				<?php include("table-tarot-leagues.php"); ?>
			</div>

			<!-- Sidebar -->
			<div class="sidebar">
				<!-- Publicité -->
				<div class="ad-container">
					<?php include("ad-rummy.php"); ?>
				</div>
				<!-- SIDEBAR CTA -->
				<?php include("sidebar-cta-game.php"); ?>
			</div>
		</div>
		
        <?php include("tarot-leagues-outro.php"); ?>
		
		<?php include("more-games.php"); ?>
    </div>

    <?php include("footer.php"); ?>
	
	<?php include("script.php"); ?>

</body>
</html>

