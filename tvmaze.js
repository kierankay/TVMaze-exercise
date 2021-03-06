/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async so it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let showArray = []
  let response = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: query } })
  for (let item of response.data) {
    showArray.push(item.show)
  }
  return showArray;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${show.image.original || 'https://tinyurl.com/tv-missing'}">
             <button data-toggle="modal" data-target="#exampleModal" type="button" data-show-name="${show.name}" data-show-id="${show.id}" class="episode-button btn btn-primary" style="margin-top: 15px;">Get Episodes</button>
            </div>
         </div>
       </div>
      `);
    $showsList.append($item);
    $('.episode-button').on('click', function (e) {
      getEpisodes(e.target.getAttribute('data-show-id')).then(function (val) {
        let showName = e.target.getAttribute('data-show-name');
        populateEpisodes(val, showName);
      });
    });
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above

  let episodesArr = []
  let episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  for (let i of episodes.data) {
    episodesArr.push(i);
  }
  return episodesArr;
}

function populateEpisodes(episodesList, show) {
  console.log(show);
  // $('#episodes-area').css('display', 'initial');
  $('#episodes-list').html('');
  $('.modal-title').html(`<h5>${show} Episode List</h5>`);
  $('.modal-body').html('');
  for (let episode of episodesList) {
    $('.modal-body').append(`<li>${episode.name}</li>`);
  }

}
