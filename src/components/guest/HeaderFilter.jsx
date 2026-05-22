import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderFilter = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/WishList");
  };
  const handleSubmit22 = async (e) => {
    e.preventDefault();
    navigate("/addmoretime");
  };
  return (
    <>
      {/* for filter */}

      <div
        className="modal fade filters-modal"
        id="filters-popup"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-body">
              <div className="filters-wrap">
                <form action="">
                  <div className="filters-in pt-0">
                    <h2>Type of place</h2>
                    <p>Search rooms, entire homes, or any type of place.</p>
                    <div className="type-in">
                      <input
                        type="radio"
                        checked
                        hidden
                        id="any_type"
                        value="1"
                        name="place_type"
                      />
                      <label for="any_type">Any Type</label>
                      <input
                        type="radio"
                        hidden
                        id="room"
                        value="2"
                        name="place_type"
                      />
                      <label for="room">Room</label>
                      <input
                        type="radio"
                        hidden
                        id="entire_home"
                        value="3"
                        name="place_type"
                      />
                      <label for="entire_home">Entire Home</label>
                    </div>
                  </div>
                  <div className="filters-in">
                    <h2>Price range</h2>
                    <p>Hour prices before fees and taxes</p>
                    <div className="price-in">
                      <div className="range-slider-in">
                        <img
                          src="/images/filters/price-range.svg"
                          loading="lazy" alt=""
                        />
                        <input
                          value="50"
                          min="50"
                          max="150"
                          step="1"
                          type="range"
                        />
                        <input
                          value="150"
                          min="50"
                          max="150"
                          step="1"
                          type="range"
                        />
                      </div>
                      <div className="price-minmax-wrap">
                        <div className="price-minmax-in" data-required="$">
                          <span>Minimum</span>
                          <input type="number" value="50" min="50" max="150" />
                        </div>
                        <hr />
                        <div className="price-minmax-in" data-required="$">
                          <span>Maximum</span>
                          <input type="number" value="150" min="50" max="150" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="filters-in">
                    <div className="location-date-wrap">
                      <div className="loaction-in">
                        <button
                          className="loaction-button location-date-btn"
                          type="button"
                        >
                          <img
                            src="/images/create-profile/location.svg"
                            loading="lazy" alt=""
                          />
                          Location <i className="fa-solid fa-pen"></i>
                        </button>
                        <div className="loaction-in-list location-date-list">
                          <ul>
                            <li>
                              <a href="#">
                                {" "}
                                <img
                                  src="/images/filters/where-icons.svg"
                                  loading="lazy" alt=""
                                />
                                Alaska, US
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img
                                  src="/images/filters/where-icons.svg"
                                  loading="lazy" alt=""
                                />
                                California, US
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img
                                  src="/images/filters/where-icons.svg"
                                  loading="lazy" alt=""
                                />
                                Delaware, US
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img
                                  src="/images/filters/where-icons.svg"
                                  loading="lazy" alt=""
                                />
                                Florida, US
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img
                                  src="/images/filters/where-icons.svg"
                                  loading="lazy" alt=""
                                />
                                New York, US
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="date-in">
                        <button
                          className="date-button location-date-btn"
                          type="button"
                        >
                          <img
                            src="/images/filters/calendar-icon.svg"
                            loading="lazy" alt=""
                          />
                          Date <i className="fa-solid fa-pen"></i>
                        </button>
                        <div className="date-in-list location-date-list">
                          <div className="date-in-data-in">
                            <div className="date-in-data-dropdown">
                              <select>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                              <select>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                              </select>
                              <select>
                                <option value="1">2024</option>
                                <option value="2">2025</option>
                                <option value="3">2026</option>
                                <option value="4">2027</option>
                                <option value="5">2028</option>
                              </select>
                            </div>
                            <input type="button" value="Save" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="filters-in">
                    <div className="time-wrap">
                      <button type="button" className="time-button">
                        {" "}
                        <i className="fa-light fa-clock"></i> Time{" "}
                      </button>
                      <div className="time-in">
                        <select>
                          <option value="1">2 hours</option>
                          <option value="2">4 hours</option>
                          <option value="3">6 hours</option>
                          <option value="4">8 hours</option>
                          <option value="5">10 hours</option>
                          <option value="6">12 hours</option>
                          <option value="7">14 hours</option>
                          <option value="8">16 hours</option>
                          <option value="9">18 hours</option>
                          <option value="10">20 hours</option>
                        </select>
                        <button type="button" className="time-in-btn">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="filters-in">
                    <h2>Preferences</h2>
                    <p>Number of people</p>
                    <div className="preferences-wrap">
                      <div className="preferences-in">
                        <input
                          type="radio"
                          checked
                          id="any_people"
                          value="1"
                          hidden
                          name="people"
                        />
                        <label for="any_people">Any</label>
                        <input
                          type="radio"
                          id="people_3"
                          value="2"
                          hidden
                          name="people"
                        />
                        <label for="people_3">3</label>
                        <input
                          type="radio"
                          id="people_4"
                          value="3"
                          hidden
                          name="people"
                        />
                        <label for="people_4">4</label>
                        <input
                          type="radio"
                          id="people_5"
                          value="4"
                          hidden
                          name="people"
                        />
                        <label for="people_5">5</label>
                        <input
                          type="radio"
                          id="people_7"
                          value="5"
                          hidden
                          name="people"
                        />
                        <label for="people_7">7</label>
                        <input
                          type="radio"
                          id="people_8_plus"
                          value="6"
                          hidden
                          name="people"
                        />
                        <label for="people_8_plus">8+</label>
                      </div>
                      <div className="preferences-right">
                        <input type="number" placeholder="Type..." />
                        <button type="button">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                    <p>Property size (sq ft)</p>
                    <div className="preferences-wrap">
                      <div className="preferences-in">
                        <input
                          type="radio"
                          checked
                          id="any_size"
                          value="1"
                          hidden
                          name="size"
                        />
                        <label for="any_size">Any</label>
                        <input
                          type="radio"
                          id="size_250"
                          value="2"
                          hidden
                          name="size"
                        />
                        <label for="size_250">250</label>
                        <input
                          type="radio"
                          id="size_350"
                          value="3"
                          hidden
                          name="size"
                        />
                        <label for="size_350">350</label>
                        <input
                          type="radio"
                          id="size_450"
                          value="4"
                          hidden
                          name="size"
                        />
                        <label for="size_450">450</label>
                        <input
                          type="radio"
                          id="size_550"
                          value="5"
                          hidden
                          name="size"
                        />
                        <label for="size_550">550</label>
                        <input
                          type="radio"
                          id="size_650"
                          value="6"
                          hidden
                          name="size"
                        />
                        <label for="size_650">650</label>
                        <input
                          type="radio"
                          id="size_750"
                          value="7"
                          hidden
                          name="size"
                        />
                        <label for="size_750">750</label>
                      </div>
                      <div className="preferences-right">
                        <input type="number" placeholder="Type..." />
                        <button type="button">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                    <p>Parking space capacity</p>
                    <div className="preferences-wrap">
                      <div className="preferences-in">
                        <input
                          type="radio"
                          checked
                          id="any_capacity"
                          value="1"
                          hidden
                          name="capacity"
                        />
                        <label for="any_capacity">Any</label>
                        <input
                          type="radio"
                          id="capacity_1"
                          value="2"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_1">1</label>
                        <input
                          type="radio"
                          id="capacity_2"
                          value="3"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_2">2</label>
                        <input
                          type="radio"
                          id="capacity_3"
                          value="4"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_3">3</label>
                        <input
                          type="radio"
                          id="capacity_4"
                          value="5"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_4">4</label>
                        <input
                          type="radio"
                          id="capacity_5"
                          value="6"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_5">5</label>
                        <input
                          type="radio"
                          id="capacity_6"
                          value="7"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_6">6</label>
                        <input
                          type="radio"
                          id="capacity_7"
                          value="8"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_7">7</label>
                        <input
                          type="radio"
                          id="capacity_8_plus"
                          value="9"
                          hidden
                          name="capacity"
                        />
                        <label for="capacity_8_plus">8+</label>
                      </div>
                      <div className="preferences-right">
                        <input type="number" placeholder="Type..." />
                        <button type="button">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                    <p>Bedrooms</p>
                    <div className="preferences-wrap">
                      <div className="preferences-in">
                        <input
                          type="radio"
                          checked
                          id="any_bedrooms"
                          value="1"
                          hidden
                          name="bedrooms"
                        />
                        <label for="any_bedrooms">Any</label>
                        <input
                          type="radio"
                          id="bedrooms_1"
                          value="2"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_1">1</label>
                        <input
                          type="radio"
                          id="bedrooms_2"
                          value="3"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_2">2</label>
                        <input
                          type="radio"
                          id="bedrooms_3"
                          value="4"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_3">3</label>
                        <input
                          type="radio"
                          id="bedrooms_4"
                          value="5"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_4">4</label>
                        <input
                          type="radio"
                          id="bedrooms_5"
                          value="6"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_5">5</label>
                        <input
                          type="radio"
                          id="bedrooms_6"
                          value="7"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_6">6</label>
                        <input
                          type="radio"
                          id="bedrooms_7"
                          value="8"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_7">7</label>
                        <input
                          type="radio"
                          id="bedrooms_8_plus"
                          value="9"
                          hidden
                          name="bedrooms"
                        />
                        <label for="bedrooms_8_plus">8+</label>
                      </div>
                      <div className="preferences-right">
                        <input type="number" placeholder="Type..." />
                        <button type="button">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                    <p>Bathrooms</p>
                    <div className="preferences-wrap">
                      <div className="preferences-in">
                        <input
                          type="radio"
                          checked
                          id="any_bathrooms"
                          value="1"
                          hidden
                          name="bathrooms"
                        />
                        <label for="any_bathrooms">Any</label>
                        <input
                          type="radio"
                          id="bathrooms_1"
                          value="2"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_1">1</label>
                        <input
                          type="radio"
                          id="bathrooms_2"
                          value="3"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_2">2</label>
                        <input
                          type="radio"
                          id="bathrooms_3"
                          value="4"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_3">3</label>
                        <input
                          type="radio"
                          id="bathrooms_4"
                          value="5"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_4">4</label>
                        <input
                          type="radio"
                          id="bathrooms_5"
                          value="6"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_5">5</label>
                        <input
                          type="radio"
                          id="bathrooms_6"
                          value="7"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_6">6</label>
                        <input
                          type="radio"
                          id="bathrooms_7"
                          value="8"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_7">7</label>
                        <input
                          type="radio"
                          id="bathrooms_8_plus"
                          value="9"
                          hidden
                          name="bathrooms"
                        />
                        <label for="bathrooms_8_plus">8+</label>
                      </div>
                      <div className="preferences-right">
                        <input type="number" placeholder="Type..." />
                        <button type="button">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="filters-in">
                    <h2>Activities</h2>
                    <div className="activities-wrap">
                      <input
                        type="checkbox"
                        value="1"
                        name="activities"
                        id="activitie_1"
                        hidden
                      />
                      <label for="activitie_1">
                        {" "}
                        <img
                          src="/images/filters/activities/1.svg"
                          loading="lazy" alt=""
                        />{" "}
                        Stays{" "}
                      </label>
                      <input
                        type="checkbox"
                        value="2"
                        name="activities"
                        id="activitie_2"
                        hidden
                      />
                      <label for="activitie_2">
                        {" "}
                        <img
                          src="/images/filters/activities/2.svg"
                          loading="lazy" alt=""
                        />{" "}
                        Event Space
                      </label>
                      <input
                        type="checkbox"
                        value="3"
                        name="activities"
                        id="activitie_3"
                        hidden
                      />
                      <label for="activitie_3">
                        {" "}
                        <img
                          src="/images/filters/activities/3.svg"
                          loading="lazy" alt=""
                        />{" "}
                        Photo shoot
                      </label>
                      <input
                        type="checkbox"
                        value="4"
                        name="activities"
                        id="activitie_4"
                        hidden
                      />
                      <label for="activitie_4">
                        {" "}
                        <img
                          src="/images/filters/activities/4.svg"
                          loading="lazy" alt=""
                        />{" "}
                        Meeting
                      </label>
                      <button type="button">
                        Other Activities{" "}
                        <i className="fa-regular fa-angle-down"></i>
                      </button>
                      <div className="activities-in">
                        <input
                          type="checkbox"
                          value="5"
                          name="activities"
                          id="activitie_5"
                          hidden
                        />
                        <label for="activitie_5">
                          {" "}
                          <img
                            src="/images/filters/activities/5.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Party
                        </label>
                        <input
                          type="checkbox"
                          value="6"
                          name="activities"
                          id="activitie_6"
                          hidden
                        />
                        <label for="activitie_6">
                          {" "}
                          <img
                            src="/images/filters/activities/6.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Film Shoot
                        </label>
                        <input
                          type="checkbox"
                          value="7"
                          name="activities"
                          id="activitie_7"
                          hidden
                        />
                        <label for="activitie_7">
                          {" "}
                          <img
                            src="/images/filters/activities/7.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Performance
                        </label>
                        <input
                          type="checkbox"
                          value="8"
                          name="activities"
                          id="activitie_8"
                          hidden
                        />
                        <label for="activitie_8">
                          {" "}
                          <img
                            src="/images/filters/activities/8.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Workshop
                        </label>
                        <input
                          type="checkbox"
                          value="9"
                          name="activities"
                          id="activitie_9"
                          hidden
                        />
                        <label for="activitie_9">
                          {" "}
                          <img
                            src="/images/filters/activities/9.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Corporate Event{" "}
                        </label>
                        <input
                          type="checkbox"
                          value="10"
                          name="activities"
                          id="activitie_10"
                          hidden
                        />
                        <label for="activitie_10">
                          {" "}
                          <img
                            src="/images/filters/activities/10.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Wedding
                        </label>
                        <input
                          type="checkbox"
                          value="11"
                          name="activities"
                          id="activitie_11"
                          hidden
                        />
                        <label for="activitie_11">
                          {" "}
                          <img
                            src="/images/filters/activities/11.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Dinner
                        </label>
                        <input
                          type="checkbox"
                          value="12"
                          name="activities"
                          id="activitie_12"
                          hidden
                        />
                        <label for="activitie_12">
                          {" "}
                          <img
                            src="/images/filters/activities/12.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Retreat
                        </label>
                        <input
                          type="checkbox"
                          value="13"
                          name="activities"
                          id="activitie_13"
                          hidden
                        />
                        <label for="activitie_13">
                          {" "}
                          <img
                            src="/images/filters/activities/13.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Pop-up
                        </label>
                        <input
                          type="checkbox"
                          value="14"
                          name="activities"
                          id="activitie_14"
                          hidden
                        />
                        <label for="activitie_14">
                          {" "}
                          <img
                            src="/images/filters/activities/14.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Networking
                        </label>
                        <input
                          type="checkbox"
                          value="15"
                          name="activities"
                          id="activitie_15"
                          hidden
                        />
                        <label for="activitie_15">
                          {" "}
                          <img
                            src="/images/filters/activities/15.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Fitness ClassName{" "}
                        </label>
                        <input
                          type="checkbox"
                          value="16"
                          name="activities"
                          id="activitie_16"
                          hidden
                        />
                        <label for="activitie_16">
                          {" "}
                          <img
                            src="/images/filters/activities/16.svg"
                            loading="lazy" alt=""
                          />{" "}
                          Audio Recording{" "}
                        </label>
                        <input
                          type="checkbox"
                          value="17"
                          name="activities"
                          id="activitie_17"
                          hidden
                        />
                        <label for="activitie_17">
                          {" "}
                          <img
                            src="/images/filters/activities/17.svg"
                            loading="lazy" alt=""
                          />
                          Swimming Pool{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="filters-in">
                    <h2>Amenities</h2>
                    <div className="amenities-wrap">
                      {/* <label>
                        <input type="checkbox" value="1" name="amenities" />{" "}
                        Wifi
                      </label> */}
                      <label>
                        <input type="checkbox" value="2" name="amenities" />{" "}
                        Kitchen
                      </label>
                      <label>
                        <input type="checkbox" value="3" name="amenities" />{" "}
                        Washer
                      </label>
                      <label>
                        <input type="checkbox" value="4" name="amenities" />{" "}
                        Dryer
                      </label>
                      <label>
                        <input type="checkbox" value="5" name="amenities" /> Air
                        conditioning
                      </label>
                      <label>
                        <input type="checkbox" value="6" name="amenities" />{" "}
                        Heating
                      </label>
                      <label>
                        <input type="checkbox" value="7" name="amenities" />{" "}
                        Free Parking
                      </label>
                      <label>
                        <input type="checkbox" value="8" name="amenities" />{" "}
                        Meal Included
                      </label>
                      <label>
                        <input type="checkbox" value="9" name="amenities" />{" "}
                        Elevator/Lift Access
                      </label>
                      <label>
                        <input type="checkbox" value="10" name="amenities" />{" "}
                        Wheelchair Accessible
                      </label>
                      <label>
                        <input type="checkbox" value="11" name="amenities" />{" "}
                        Smoking Allowed
                      </label>
                      <label>
                        <input type="checkbox" value="12" name="amenities" />{" "}
                        Non-Smoking Property
                      </label>
                      <button type="button">Show More</button>
                    </div>
                  </div>
                  <div className="filters-in">
                    <h2>Booking</h2>
                    <div className="booking-wrap">
                      <div className="booking-in">
                        <h4>
                          <b />
                          Instant Book <br />
                          Listings you can book without waiting for host
                          approval
                        </h4>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div className="booking-in">
                        <h4>
                          <b />
                          Self check-in
                          <br /> Easy access to the property once you arrive
                        </h4>
                        <label className="switch">
                          <input type="checkbox" checked />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div className="booking-in">
                        <h4>
                          <b>Allows pets</b>
                          <span className="info-icon">
                            <img
                              src="/images/create-profile/info.svg"
                              loading="lazy" alt=""
                            />
                            <span className="info-text">
                              Your safety and peace of mind are our top
                              priorities. ZYVO is proud to provide comprehensive
                              liability insurance coverage for all bookings
                            </span>
                          </span>
                        </h4>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="filters-in">
                    <h2>Language</h2>
                    <div className="language-wrap">
                      <label>
                        <input type="checkbox" value="1" name="language" />{" "}
                        English
                      </label>
                      <label>
                        <input type="checkbox" value="2" name="language" />{" "}
                        French
                      </label>
                      <label>
                        <input type="checkbox" value="3" name="language" />{" "}
                        German
                      </label>
                      <label>
                        <input type="checkbox" value="4" name="language" />{" "}
                        Japanese
                      </label>
                      <label>
                        <input type="checkbox" value="5" name="language" />{" "}
                        English
                      </label>
                      <label>
                        <input type="checkbox" value="6" name="language" />{" "}
                        French
                      </label>
                      <label>
                        <input type="checkbox" value="7" name="language" />{" "}
                        German
                      </label>
                      <label>
                        <input type="checkbox" value="8" name="language" />{" "}
                        Japanese
                      </label>
                      <label>
                        <input type="checkbox" value="9" name="language" />{" "}
                        English
                      </label>
                      <label>
                        <input type="checkbox" value="10" name="language" />{" "}
                        French
                      </label>
                      <label>
                        <input type="checkbox" value="11" name="language" />{" "}
                        German
                      </label>
                      <label>
                        <input type="checkbox" value="12" name="language" />{" "}
                        Japanese
                      </label>
                      <button type="button">Show More</button>
                    </div>
                  </div>
                  <div className="filter-button-wrap">
                    <label className="filter-button-in active">
                      <input type="reset" value="Clean All" />
                      <i className="fa-solid fa-rotate-left"></i>
                    </label>
                    <label className="filter-button-in">
                      <input type="submit" value="Search" />
                      <i className="fa-regular fa-magnifying-glass"></i>
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- NEED-MORE-TIME-POPUP --> */}
      <div
        className="modal fade custom-modal"
        id="need-more-time-popup"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-body">
              <h2>Need More Time?</h2>
              <div className="password-changed-successfully-icon">
                <img
                  src="/images/popups/logout.svg"
                  loading="lazy" alt=""
                />
              </div>
              <p className="mb-3">
                To Extend your booking time. Please <br /> click ‘yes” below.
              </p>
              <form onSubmit={handleSubmit22} method="post">
                <div className="custom-modal-label d-flex gap-3">
                  <input type="submit" value="Yes" data-bs-dismiss="modal" />
                  <input
                    type="button"
                    className="cancel-btn"
                    value="Cancel"
                    data-bs-dismiss="modal"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- NEED-MORE-TIME-POPUP --> */}

      {/* <!-- ADD-WISHLIST-POPUP --> */}
      <div
        className="modal fade"
        id="add-wishlist"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add to Wishlist</h2>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body px-4 py-4">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="explore-guides-articles-in">
                    <a href="#">
                      <div className="explore-guides-articles-image">
                        <img
                          src="/images/locations-grid/1.svg"
                          loading="lazy" alt=""
                        />
                      </div>
                      <h3>Sea view</h3>
                      <p>4 saved</p>
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="explore-guides-articles-in">
                    <a href="#">
                      <div className="explore-guides-articles-image">
                        <img
                          src="/images/locations-grid/2.svg"
                          loading="lazy" alt=""
                        />
                      </div>
                      <h3>Cabin in Peshastin</h3>
                      <p>4 saved</p>
                    </a>
                  </div>
                </div>
                <div className="explore-guides-articles-wrap-btn">
                  <a
                    href="#"
                    data-bs-dismiss="modal"
                    data-bs-target="#create-wishlist"
                    data-bs-toggle="modal"
                  >
                    Create Wishlist
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ADD-WISHLIST-POPUP --> */}

      {/* <!-- CREATE-WISHLIST-POPUP --> */}
      <div
        className="modal fade custom-modal"
        id="create-wishlist"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Wishlist</h2>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body px-4 py-4">
              <form onSubmit={handleSubmit} method="post">
                <p>Please Enter the name</p>
                <label>
                  <input type="text" className="ps-3" placeholder="Name" />
                </label>
                <textarea placeholder="Description"></textarea>
                <p>Max 50 characters</p>
                <div className="custom-modal-label d-flex gap-3">
                  <input type="submit" value="Create" data-bs-dismiss="modal" />
                  <input type="reset" className="cancel-btn" value="Clear" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- CREATE-WISHLIST-POPUP --></div> */}
    </>
  );
};

export default HeaderFilter;
