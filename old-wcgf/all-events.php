<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Tournaments | WCGF</title>
    
	<?php include("head.php"); ?>
	
</head>
<body>
	
	<?php include("top.php"); ?>
	
    <?php include("header.php"); ?>
	
	<div class="page-header-home">
		<h1>WCGF TOURNAMENTS</h1>
		<p class="page-header-home-text">
			Welcome to WCGF.com Tournaments page<br>
			Here come the next events for Tarot,Rummy and Scopa
		</p>
		<div><?php include("events.php"); ?></div>
	</div>


    <div class="container">
        <?php include("events-intro.php"); ?>
		
		<div class="content-with-sidebar">
			<!-- Contenu principal -->
			<div class="main-content">
				<?php include("table-tarot-events.php"); ?>
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
		
		<?php include("events-outro.php"); ?>
				
		<?php include("more-games.php"); ?>
    </div>

    <?php include("footer.php"); ?>
	
	<?php include("script.php"); ?>

</body>
</html>

