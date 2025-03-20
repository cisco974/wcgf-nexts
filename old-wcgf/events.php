<div class="event-slider-container">
    <button class="slider-btn prev" onclick="slide(-1)">
        <img src="img/icons/down-white.png" alt="<">
    </button>
    <div class="event-slider">
        <div class="event-slide">
            <?php
                $events = [
                    ["title" => "Tarot", "subtitle" => "4 players", "icon" => "img/store/icon-tarot.jpg", "month" => "MAY", "day" => "02", "buyin" => "250"],
                    ["title" => "Scopa", "subtitle" => "2 players", "icon" => "img/store/icon-scopa.jpg", "month" => "MAY", "day" => "04", "buyin" => "500"],
                    ["title" => "Rummy", "subtitle" => "3 players", "icon" => "img/store/icon-rummy.jpg", "month" => "MAY", "day" => "06", "buyin" => "1000"],
                    ["title" => "Tarot", "subtitle" => "5 players", "icon" => "img/store/icon-tarot.jpg", "month" => "MAY", "day" => "08", "buyin" => "500"],
                    ["title" => "Scopa", "subtitle" => "4 players", "icon" => "img/store/icon-scopa.jpg", "month" => "MAY", "day" => "10", "buyin" => "1000"],
                ];

                foreach ($events as $event) {
                    echo '<div class="event" data-month="' . $event["month"] . '" data-day="' . $event["day"] . '">
                            <div class="event-info">
                                <p class="event-title">' . $event["title"] . '</p>
                                <p class="event-subtitle">' . $event["subtitle"] . '</p>
                                <p class="event-buyin">' . $event["buyin"] . '</p>
                            </div>
                            <img class="event-icon" src="' . $event["icon"] . '" alt="Icon">
                          </div>';
                }
            ?>
        </div>
    </div>
    <button class="slider-btn next" onclick="slide(1)">
        <img src="img/icons/down-white.png" alt=">">
    </button>
</div>