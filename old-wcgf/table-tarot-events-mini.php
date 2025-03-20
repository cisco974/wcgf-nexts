<div class="event-container">
	<img src="img/tarot/logo.png" alt="Super Tarot" class="logo-table">
	<div class="event-slider-home">
        <div class="event-slide-home">
            <?php
                $events = [
                    ["title" => "Super Tarot", "subtitle" => "4 players", "icon" => "./img/store/icon-tarot.jpg", "month" => "MAY", "day" => "02", "buyin" => "250"],
                    ["title" => "Super Scopa", "subtitle" => "2 players", "icon" => "./img/store/icon-scopa.jpg", "month" => "MAY", "day" => "04", "buyin" => "500"],
                    ["title" => "Super Rummy", "subtitle" => "3 players", "icon" => "./img/store/icon-rummy.jpg", "month" => "MAY", "day" => "06", "buyin" => "1000"],
                ];

                foreach ($events as $event) {
                    echo '<div class="event-home" data-month="' . $event["month"] . '" data-day="' . $event["day"] . '">
                            <div class="event-info">
                                <p class="event-title">' . $event["title"] . '</p>
                                <p class="event-subtitle">' . $event["subtitle"] . '</p>
                            </div>
                            <img class="event-icon" src="' . $event["icon"] . '" alt="Icon">
                          </div>';
                }
            ?>
        </div>
    </div>
</div>