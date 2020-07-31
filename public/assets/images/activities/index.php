<?php
include '../Dashboard/php/connect.php';
?>

<!DOCTYPE html>
<html dir='ltr' lang='en-US'>
<head>

	<meta http-equiv='content-type' content='text/html; charset=utf-8' />
	<meta name='author' content='SemiColonWeb' />
	<!-- Disable screen scaling-->
  <meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, user-scalable=0'>


	<!-- Stylesheets
	============================================= -->
	<link href='https://fonts.googleapis.com/css?family=Lato:300,400,400i,700|Raleway:300,400,500,600,700|Crete+Round:400i' rel='stylesheet' type='text/css' />
	<link rel='stylesheet' href='../css/bootstrap.min.css' type='text/css' />
	<link rel='stylesheet' href='../css/timeline_style.css' type='text/css' />
	<link rel='stylesheet' href='../css/animate_timeline.css' type='text/css' />
	<link rel='stylesheet' href='../css/magnific-popup_timeline.css' type='text/css' />
	<link rel='stylesheet' href='../fonts/font-awesome.min.css'>
	
	<link rel='stylesheet' href='../css/responsive_timeline.css' type='text/css' />


	<!-- Document Title
	============================================= -->
	<title>iEDC Activities</title>
		<!--Page Icon in title bar-->
		<link rel='icon' type='img/png' href='../img/logo.ico'>
	
	<style type='text/css'>
		#act,#page-title,#content{
		background: linear-gradient(to right,#13547a,#80d0c7 );
		
		}
		h1,h2,p,#thead,.text{
			color:#ffffff!important;
		}
		#dateline{
		background-color: rgba(0, 96, 100, 0.9);
		color:#ffffff;
		border-radius: 25px;

		}
		.entry-meta,{
			color:#000000!important;
		}

		.all-menu-wrapper{
		background-color: rgba(0, 96, 100, 2.9)!important;
		

		}
		.navbar-mainmenu{
		background-color: rgba(0,96,100,0.8)!important;
		}

		
	</style>
	
	<!-- Main CSS files -->
  	<link rel='stylesheet' href='../css/activitiesnavbar.css'>
  	<link rel='stylesheet' href='../fonts/opensans/stylesheet.css'>
</head>



<body class='stretched' id=act>


  <!-- BEGIN OF site header Menu -->
  <header class='page-header navbar page-header-alpha scrolled-white menu-right topmenu-right'>

    <!-- Begin of menu icon toggler -->
    <button class='navbar-toggler site-menu-icon' id='navMenuIcon'>
      <!-- Available class : menu-icon-dot / menu-icon-thick /menu-icon-random -->
      <span class='menu-icon menu-icon-random'>
        <span class='bars'>
          <span class='bar1'></span>
          <span class='bar2'></span>
          <span class='bar3'></span>
        </span>
      </span>
    </button>
    <!-- End of menu icon toggler -->

    <!-- Begin of logo/brand -->
    <a class='navbar-brand' href='../index.html'>
      <span class='logo'>
        <img class='light-logo' src='../img/logo.png' alt='Logo'>
      </span>
      <span class='text'>
        iEDC NSSCE
      
      </span>
    </a>
    <!-- End of logo/brand -->

    <!-- begin of menu wrapper -->
    <div class='all-menu-wrapper' id='navbarMenu'>
     

      <!-- Begin of hamburger mainmenu menu -->
      <nav class='navbar-mainmenu'>
        <ul class='navbar-nav mr-auto'>
          <li class='nav-item active'>
            <a class='nav-link' href='../index.php#home'>Home
            </a>
          </li>
          <li class='nav-item'>
           <a class='nav-link' href='../startup.html'>Startups</a>
          </li>
          <li class='nav-item active'>
            <a class='nav-link' href='index.php'>Our Activities
            <span class='sr-only'>(current)</span>
            </a>
          </li>
          <li class='nav-item'>
            <a class='nav-link' href='../team.html'>Team</a>
          </li>
            <li class='nav-item'>
            <a class='nav-link' href='../index.php#contact'>Contact</a>
          </li>
        </ul>
      </nav>
      <!-- End of hamburger mainmenu menu -->
    </div>
    <!-- end of menu wrapper -->

  </header>
  <!-- END OF site header Menu--><br><br>

  <div id='wrapper' class='clearfix'>
    <section id='page-title'>
      <div class='container clearfix'>
        <span id='thead'><h1 style='color: white'>Activities we have done so far</h1></span>
      </div>
    </section>
    
    <section id='content'>
      <div class='content-wrap'>
        <div class='container clearfix'>
          <div id='posts' class='post-grid grid-container post-masonry post-timeline grid-2 clearfix'>
            <div class='timeline-border'></div>

    
        <!--a section - images + description -->
        <?php
          $date=Date('Y');
          $i=$date; 
          while($i>=2014) 
          {
            $sql="SELECT * FROM activities WHERE year = $i ORDER BY id DESC";
            $result= $conn->query($sql);
            if($result->num_rows>0)
            {
              echo "
              <div class='entry entry-date-section'>
                <span id='dateline'>YEAR $i
                </span>
              </div> ";
                      while($row=$result->fetch_assoc())
                      {

                        $year=$row['year'];
                        $id=$row['id'];
                        $date=date_format(date_create($row['date']),'F d, Y ');//to create date in the form January 1, 2020
                        $title=$row['title'];
                        $detail=$row['detail'];
                        $type=$row['type'];
                        $imageyes=$row['imageyes'];
                        $images=$row['images'];
                        echo "
                          <div class='entry clearfix'>
                            <div class='entry-timeline'>
                              <div class='timeline-divider'></div>
                            </div>";

                              //if image is available execute this
                              if ($imageyes==1) 
                              {
                                  if($images==1)
                                  {
                                        echo "
                                          <div class='entry-image'> 
                                          <a href='$year/$id.jpg' data-lightbox='image'><img class='image_fade' src='$year/$id.jpg' alt='$title'></a>
                                          </div>";
                                  }
                                  else
                                  {
                                        $j=$images;
                                        echo "<div class='entry-image'>
                                                <div class='fslider' data-arrows='false' data-lightbox='gallery'>
                                                  <div class='flexslider'>
                                                    <div class='slider-wrap'>
                                                  ";
                                        while($j>0)
                                        {
                                          echo"<div class='slide'>
                                                  <a href='$year/$id-$j.jpg' data-lightbox='gallery-item'>
                                                  <img class='image_fade' src='$year/$id-$j.jpg' alt='$title image'>
                                                  </a>
                                                </div>";
                                          --$j;
                                        }
                                        echo  "   </div>
                                                </div>
                                              </div>
                                            </div>";
                                  }
                              }
                              //image section over
                            
                              echo "
                                <div class='entry-title'>
                                <h2>
                                <img class='image_fade' src='$type.png' alt='$type Logo' style='height:50px; width:50px;
                                border-radius:50%;'>&nbsp;$title</h2>
                              </div>
                              <ul class='entry-meta clearfix'>
                                <li style='color: white'><i class='fa fa-calendar'></i>$date</li>
                              </ul>
                              <div class='entry-content'>
                                <p>$detail</p>
                              </div>
                              </div>";
                       
                      }
              --$i;
            }
            else
            {
                --$i;
            }
                    
          }
        
        echo"   
        <!-- end of a section -->

          </div>
        </div>
      </div>
    </section>





     <!-- Javascript main files -->
      <script src='../js/vendor/jquery-1.12.4.min.js'></script>
      <script src='../js/main.js'></script>

      <!-- Go To Top
      ============================================= -->
      <div id='gotoTop' class='fa fa-angle-up'></div>

      <!-- External JavaScripts
      ============================================= -->
      <script src='../js/jquery_timeline.js'></script>
      <script src='../js/plugins_timeline.js'></script>

      <!-- Footer Scripts
      ============================================= -->
      <script src='../js/functions_timeline.js'></script>


      <!-- scripts -->
      <!-- All Javascript plugins goes here -->

      <!-- All vendor scripts -->

      <script src='../js/vendor/all.js'></script>

      <!-- Form script -->
      <script src='../js/form_script.js'></script>

      <!-- Javascript main files -->
      <script src='../js/main.js'></script>


      <script src='js/activities.js'>
      </script>

</body>
</html>";
  $conn->close(); 
?>