<div class="home-block">
	<!--div class="logo-container">
        <img src="img/tarot/logo.png" alt="Logo" class="center-logo">
    </div-->
	<div class="selector search-bar">
		<input type="text" id="search-player" placeholder="SEARCH FOR A PLAYER BY USERNAME OR ID...">
		<button onclick="searchPlayer()">SEARCH</button>
	</div>
	<div class="header-table">
		<div class="header-content">
			<img src="img/medals/1.png" alt="Medal" class="header-medal">
			<h3 class="title-table" style="margin: 0;">League 1</h3>
		</div>
		<div class="dropdown-bar" style="margin: 0;">
			<select id="select-league" onchange="updateDivisions()">
				<option value="1">League 1</option>
				<option value="2">League 2</option>
				<option value="3">League 3</option>
				<option value="4">League 4</option>
				<option value="5">League 5</option>
				<option value="6">League 6</option>
				<option value="7">League 7</option>
				<option value="8">League 8</option>
				<option value="9">League 9</option>
				<option value="10">League 10</option>
				<option value="11">League 11</option>
				<option value="12">League 12</option>
				<option value="13">League 13</option>
				<option value="14">League 14</option>
				<option value="15">League 15</option>
			</select>
			<select id="select-division">
				<option value="1">Division 1</option>
				<option value="2">Division 2</option>
				<option value="3">Division 3</option>
				<option value="4">Division 4</option>
				<option value="5">Division 5</option>
				<option value="6">Division 6</option>
				<option value="7">Division 7</option>
				<option value="8">Division 8</option>
				<option value="9">Division 9</option>
				<option value="10">Division 10</option>
				<option value="11">Division 11</option>
				<option value="12">Division 12</option>
				<option value="13">Division 13</option>
				<option value="14">Division 14</option>
				<option value="15">Division 15</option>
				<option value="16">Division 16</option>
				<option value="17">Division 17</option>
				<option value="18">Division 18</option>
				<option value="19">Division 19</option>
				<option value="20">Division 20</option>
				<option value="117">Division 117</option>
			</select>
			<button onclick="showRankings()">VIEW</button>
		</div>
	</div>
	<table class="table">
		<!--thead>
			<tr>
				<th></th>
				<th>Rank</th>
				<th>Avatar</th>
				<th>Username</th>
				<th>Serie</th>
				<th>Experience</th>
				<th>Rewards</th>
				<th>Points</th>
			</tr>
		</thead-->
		<tbody>
			<!-- ZONE DE PROMOTION -->
			<tr style="background-color: #7bb82d; color: white; font-weight: bold; text-align: center; border-bottom: 1px solid #e3e8ef; height:50px;">
				<td colspan="8">ZONE DE PROMOTION</td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">1</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/1.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">ProGamerX</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 10</span></td>
				<td><span class="rewards">1000</span></td>
				<td><span class="points">1500 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">2</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/2.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">Legend47</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 9</span></td>
				<td><span class="rewards">800</span></td>
				<td><span class="points">1400 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">3</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/3.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">CardMaster</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 8</span></td>
				<td><span class="rewards">700</span></td>
				<td><span class="points">1350 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">4</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/4.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">QuickDraw</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 7</span></td>
				<td><span class="rewards">600</span></td>
				<td><span class="points">1300 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">5</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/5.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">KingSlayer</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 6</span></td>
				<td><span class="rewards">500</span></td>
				<td><span class="points">1280 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">6</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/1.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">AceHunter</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 6</span></td>
				<td><span class="rewards">400</span></td>
				<td><span class="points">1260 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">7</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/2.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">DeckWizard</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 5</span></td>
				<td><span class="rewards">300</span></td>
				<td><span class="points">1240 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">8</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/3.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">TopDeck</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 5</span></td>
				<td><span class="rewards">200</span></td>
				<td><span class="points">1220 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">9</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/4.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">SharpMind</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 4</span></td>
				<td><span class="rewards">100</span></td>
				<td><span class="points">1200 PTS</span></td>
			</tr>
			<tr>
				<td>&uarr;</td>
				<td><span class="rank-box">10</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/5.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">GameChanger</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 3</span></td>
				<td><span class="rewards">50</span></td>
				<td><span class="points">1180 PTS</span></td>
			</tr>
			<!-- ZONE DE MAINTIEN -->
			<tr style="background-color: #ea5f28; color: white; font-weight: bold; text-align: center; border-bottom: 1px solid #e3e8ef;; height:50px;">
				<td colspan="8">ZONE DE MAINTIEN</td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">11</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/1.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">PlayerOne</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 2</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1160 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">12</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/2.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">RandomHero</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 3</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1140 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">13</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/3.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">RiskTaker</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 3</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1120 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">14</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/4.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">CardShark</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 3</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1100 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">15</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/5.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">LuckyDraw</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 2</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1080 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">16</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/1.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">AllIn</td>
				<td>
					<span class="serie win">V</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 4</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1060 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">17</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/2.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">CardHunter</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 3</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1040 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">18</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/3.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">BluffKing</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 2</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1020 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">19</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/4.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">DeckBuilder</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 2</span></td>
				<td><span class=""></span></td>
				<td><span class="points">1000 PTS</span></td>
			</tr>
			<tr>
				<td></td>
				<td><span class="rank-box">20</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/5.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">MindReader</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 4</span></td>
				<td><span class=""></span></td>
				<td><span class="points">980 PTS</span></td>
			</tr>
			<!-- ZONE DE RELEGATION -->
			<tr style="background-color: #d31105; color: white; font-weight: bold; text-align: center; border-bottom: 1px solid #e3e8ef;; height:50px;">
				<td colspan="8">ZONE DE RELEGATION</td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">21</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/1.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">SlowPlay</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie win">V</span>
				</td>
				<td><span class="experience">Level 2</span></td>
				<td><span class=""></span></td>
				<td><span class="points">960 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">22</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/2.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">LastStand</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">940 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">23</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/3.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">OutOfLuck</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">920 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">24</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/4.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">LowCard</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">900 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">25</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/5.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">BottomDeck</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">880 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">26</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/1.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">DesperateMove</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">860 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">27</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/2.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">NoDraw</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 4</span></td>
				<td><span class=""></span></td>
				<td><span class="points">850 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">28</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/3.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">LostCause</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">820 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">29</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/4.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">DiscardKing</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">800 PTS</span></td>
			</tr>
			<tr>
				<td>&darr;</td>
				<td><span class="rank-box">30</span></td>
				<td>
					<div class="avatar-box">
						<img src="img/avatars/5.png" alt="Avatar" style="width: 100%; height: auto;">
					</div>
				</td>
				<td style="text-align: left">DeadHand</td>
				<td>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
					<span class="serie lose">L</span>
				</td>
				<td><span class="experience">Level 1</span></td>
				<td><span class=""></span></td>
				<td><span class="points">780 PTS</span></td>
			</tr>
		</tbody>
	</table>
	<div class="presentation-footer">
		<span>
			This is the official ranking of the WCGF Tarot Super League.
			<img src="img/wcgf-black-small.png" alt="WCGF Logo" class="footer-table-logo">
		</span>
	</div>
</div>