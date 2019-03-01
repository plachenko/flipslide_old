/* FlipSlide Session */
/*
  A Session is a container of user information. It can be:

    * A temporary public session
      - No Password protection.

    * A temporary private session
      - Password protected

    * A persitent login session
      - if the user is 'logged in' store the session to the user's account

  Has:
    * ARR   Users
    * INT   Session Owner (points to user array)
    * TIME  Session Started
    * TIME  Session last opened / closed
    * ARR   Actions (session isn't stored without actions)
    STR   Session Password
*/

export default class Session{
  constructor(sesObj) {
    // this.books = sesObj.books || []
    // console.log('im here!', this.books)
  }

}
