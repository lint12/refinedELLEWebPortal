# refinedELLEWebPortal

### Module Page Functions 
- [x] searchModules()
- [x] searchCards()
- [x] addModule() : all fields must be filled out otherwise highlight the field that is not filled out 
- [ ] include dropdown list of languages (2 char format) that users can choose from 
- [x] editModule() : modal popup for the user to edit the name of the module // editing the language is forbidden 
- [x] deleteModule() : modal popup for user handling to double check if the user still wants to delete the module 
- [ ] addCard() : depends on module type, should include validation for the front/back field of the card, the tag, picture, and audio fields are optional. (3 different types of card forms need to be made.)
- [ ] include dropdown options for term types and gender 
- [ ] addExistingTerms() : be able to add existing terms under the same language as the module to the term tab
- [x] editCard() : modal popup for the user to edit the front/back of the card, and to edit the picture/audio file. 
- [ ] editTags() : edit the tags for each term in edit mode  
- [x] deleteCard() : modal popup for user handling to double check if the user still wants to delete the card 
- [x] downloadImage() needs more testing when site is deployed
- [x] downloadAudio() needs more testing when site is deploye

- [ ] Figure out new layout of organizing each individual Module to reflect the new database 
- [x] Super tiny fix: include module name next to the search bar on the card list side 

### Stat Page Functions
- TBD 

### UserList Page Functions
- TBD 

## Useful Resources 
### API 
- https://documenter.getpostman.com/view/11718453/Szzhdy4c?version=latest#50bd0f7c-2580-4aa5-b47f-856251cd49e5
- https://docs.google.com/document/d/1aiQBnWNgU0gbnhKs8gcCMAhAvQbg8qeuwIkITDbRRg8/edit
- https://alligator.io/react/axios-react/

### Database Fields and Inputs For Cards 
- Terms, words and their translations along with other information
  - Types:
    - NN  (Noun)
    - VR  (Verb)
    - AJ  (Adjective)+
    - AV  (Adverb)
    - PH  (Phrase)

  - Genders:
    - MA (Male)
    - FE (Female)
    - NA (Nongendered)

- Front/Back clarification
  - Front is the word in the foreign language (prompt),
  - Back is the word in the native language (answer)

  - Types:
    - MATCH       (Base type, uses a term as the question prompt, only one answer)
    - PHRASE      (Identical to MATCH, but for whole phrases, only one answer)
    - IMAGE       (Select a word corresponding to an image, may have multiple answers)
    - AUDIO       (Select a word corresponding to audio, may have multiple answers)
    - LONGFORM    (Questions with a full text prompt, may have multiple answers)

### Reactjs Knowledge 
#### React Life Cycle Diagram 
- https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
#### Other
- https://www.youtube.com/watch?v=M-X0Jw2e68A&t=553s
