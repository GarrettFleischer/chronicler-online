export const dragonCS =
  '*title Choice of the Dragon\n' +
  '*author Dan Fabulich and Adam Strong-Morse\n' +
  '\n' +
  '\n' +
  '*create name ""\n' +
  '*create brutality 50\n' +
  '*create cunning 50\n' +
  '*create disdain 50\n' +
  '*create gender "unknown"\n' +
  '\n' +
  '*comment I\'ve added wounds and blasphemy to provide hit points of sorts;\n' +
  '*comment if the PC gets hurt, wounds goes up, with 3 usually meaning death;\n' +
  '*comment impiety tracks whether the gods have been directly angered\n' +
  '*create wounds 0\n' +
  '*create blasphemy 0\n' +
  '*create infamy 50\n' +
  '*create wealth 5000\n' +
  '\n' +
  '*create encourage 0\n' +
  '*comment encourage = 1 if you encourage the folk religion\n' +
  '\n' +
  '*create victory 0\n' +
  '\n' +
  '*create clutchmate_alive false\n' +
  '*create vermias_killed_axilmeus false\n' +
  '*create callax_alive true\n' +
  '*comment Callax_Alive = true if Callax is alive, false if Callax is dead\n' +
  '*create Callax_With false\n' +
  '\n' +
  '\n' +
  'Let us begin.\n' +
  '\n' +
  'A knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child\'s doll.  The knight sets his lance to attack you.\n' +
  '\n' +
  'How do you defend yourself, O mighty dragon?\n' +
  '*choice\n' +
  '  #I take to the air with a quick beat of my wings.\n' +
  '    You leap to the air, deftly avoiding the knight\'s thrust.  Now that you are in the air, he hardly poses any threat at allâ€”not that he ever posed much of one to you.  You circle back and knock him off his horse with a swipe of your claw.\n' +
  '\n' +
  '    *set brutality %-10\n' +
  '    *goto Victory\n' +
  '\n' +
  '  #I knock the knight from his horse with a slap of my tail.\n' +
  '    You swing your mighty tail around and knock the knight flying.  While he struggles to stand, you break his horse\'s back and begin devouring it.\n' +
  '\n' +
  '    *set cunning %+10\n' +
  '    *goto Victory\n' +
  ' \n' +
  '  #I rush into his charge and tear him to pieces with my claws.\n' +
  '    The knight\'s lance shatters against your nigh-impenetrable hide as you slam into him.  You yank him clean off his horse, slamming him to the ground and ripping his plate armor with your vicious claws.  The fight is over before it has begun. \n' +
  '\n' +
  '    *set brutality %+10\n' +
  '    *goto Victory\n' +
  '\n' +
  '  #A puff of my fiery breath should be enough for him.\n' +
  '    You let loose an inferno of fire.  The knight\'s horse is cooked nicely, and your stomach lets out a deafening rumble as the smell of roast destrier reaches your nostrils.  The knight himself staggers to his feet.  His armor managed to keep him alive, but only barely.\n' +
  '\n' +
  '    *set disdain %+10\n' +
  '    *goto Victory\n' +
  '  *if (choice_save_allowed) #Restore a saved game.\n' +
  '    *restore_game\n' +
  '    *goto purchased\n' +
  '\n' +
  '*label Victory\n' +
  '\n' +
  'Do you finish him off, victorious dragon?\n' +
  '*choice\n' +
  '      #Of course!  How dare he attack me?\n' +
  '        Your jaws crush him in a single bite.\n' +
  '\n' +
  '        That showed him.\n' +
  '        *set brutality %+10\n' +
  '        *goto Naming\n' +
  '\n' +
  '      #I let him live to warn others of my immense power.\n' +
  '        "Begone, petty human.  To attack me is to meet your doom," you growl.\n' +
  '\n' +
  '        The knight stumbles away as quickly as he can, not even daring to pretend that he could still fight you.\n' +
  '        *set infamy %+15\n' +
  '        *goto Naming\n' +
  '\n' +
  '      #Eh.  Now that the threat is ended, he is beneath my concern.\n' +
  '        You leisurely eat the knight\'s horse.  He slinks away as quietly as he can.  (His heavy armor makes a stealthy escape impossible.)  Still, you pay him no mind as he leaves.\n' +
  '\n' +
  '        *set infamy %+10\n' +
  '        *set disdain %+10\n' +
  '        *goto Naming\n' +
  '\n' +
  '*label Naming\n' +
  '\n' +
  'You know, it\'s going to get annoying to keep calling you "great and mighty dragon."  What is your name?\n' +
  '*choice\n' +
  '    #Gorthalon.\n' +
  '        *set name "Gorthalon"\n' +
  '        *goto gender\n' +
  '    #Sssetheliss.\n' +
  '        *set name "Sssetheliss"\n' +
  '        *goto gender\n' +
  '    #Calemvir.\n' +
  '        *set name "Calemvir"\n' +
  '        *goto gender\n' +
  '    #These names are all terrible!\n' +
  '        Oh! Please forgive me.\n' +
  '        *label input_name\n' +
  '        What name would you prefer?\n' +
  '        *input_text name\n' +
  '\n' +
  '        *comment check capitalization\n' +
  '        *if ("${name}" != "$!{name}")\n' +
  '\n' +
  '            Your name is $!{name}, is that right?\n' +
  '\n' +
  '            *choice\n' +
  '                #Yes.\n' +
  '                    *set name "$!{name}"\n' +
  '                    *goto gender\n' +
  '                #No, my name is ${name}, just as I said.\n' +
  '                    *goto gender\n' +
  '                #Er, wait, let me try that again.\n' +
  '                    *goto input_name\n' +
  '\n' +
  '*label gender\n' +
  'Will you be male or female?\n' +
  '*choice\n' +
  '    #Male.\n' +
  '        *set gender "male"\n' +
  '        *goto Princess\n' +
  '    #Female.\n' +
  '        *set gender "female"\n' +
  '        *goto Princess\n' +
  '    #Neither.\n' +
  '        *set gender "neither"\n' +
  '        *goto Princess\n' +
  '    #Unknown/undetermined.\n' +
  '        *set gender "unknown"\n' +
  '        *goto Princess\n' +
  '    #Do not pester me with impudent questions!\n' +
  '        *set brutality %+ 15\n' +
  '        I, ah, I mean, yes!  Of course!  How churlish of me.\n' +
  '        \n' +
  '        But, O mighty ${name}, I feel I should let you know that this game is full of choices; indeed, it is nothing but multiple choice questions that determine the course of your adventures as a dragon.  If you don\'t enjoy answering questions, this game may not be for you!\n' +
  '        \n' +
  '        Do youâ€¦I mean, if I may, would you like to specify your gender after all?\n' +
  '        \n' +
  '        *choice\n' +
  '            #Very well.\n' +
  '                Excellent choice!  What gender will you be?\n' +
  '                \n' +
  '                *choice\n' +
  '                    #Male.\n' +
  '                        *set gender "male"\n' +
  '                        *goto Princess\n' +
  '                    #Female.\n' +
  '                        *set gender "female"\n' +
  '                        *goto Princess\n' +
  '                    #Neither.\n' +
  '                        *set gender "neither"\n' +
  '                        *goto Princess\n' +
  '                    #Unknown/undetermined.\n' +
  '                        *set gender "unknown"\n' +
  '                        *goto Princess\n' +
  '            #I said no.\n' +
  '                *set gender "unknown"\n' +
  '                \n' +
  '                Well, let\'s just leave it undetermined, then!\n' +
  '                *goto Princess\n' +
  '       \n' +
  '*label Princess\n' +
  '\n' +
  'As you think about it, the knight\'s attack was probably inevitable.  After all, you did just kidnap the princess from right out of her tower.  Althoughâ€¦\n' +
  '\n' +
  'Isn\'t it a little sexist to always kidnap princesses?\n' +
  '*temp royal\n' +
  '*choice\n' +
  '  #Maybe, but tradition demands that dragons kidnap princesses, even if that is sexist.\n' +
  '    I guess you\'re right.\n' +
  '\n' +
  '    Anyway, as you ripped the roof off her tower, the light glistened off yourâ€¦\n' +
  '    *set royal "princess"\n' +
  '    *goto color\n' +
  '  #You dare question my actions?\n' +
  '    No, no!  Of course not.  I just wanted toâ€”I meanâ€”What I\'m trying to say isâ€¦\n' +
  '\n' +
  '    Let\'s just move on.\n' +
  '\n' +
  '    Anyway, as you ripped the roof off her tower, the light glistened off yourâ€¦\n' +
  '    *set royal "princess"\n' +
  '    *goto color\n' +
  '  #You know, I never thought about that before.  In fact, I think I kidnapped a prince, just to avoid being sexist.\n' +
  '    Right you are.  As I was saying, the knight\'s attack was probably inevitable.  After all, you did just kidnap the prince \n' +
  '    from right out of his tower.  As you ripped the roof off his tower, the light glistened off yourâ€¦\n' +
  '    *set royal "prince"\n' +
  '    *goto color\n' +
  '  #I\'ll have you know that I make a careful point of alternating between princes and princesses, but it happened to be time for a princess.\n' +
  '    Of course.  I\'m sorry for questioning you.\n' +
  '\n' +
  '    Anyway, as you ripped the roof off her tower, the light glistened off yourâ€¦\n' +
  '    *set royal "princess"\n' +
  '    *goto color\n' +
  '\n' +
  '*label color\n' +
  '*temp royal_him\n' +
  '*temp royal_his\n' +
  '*temp royal_she\n' +
  '*temp royals\n' +
  '*if (royal="princess")\n' +
  '  *set royal_him "her"\n' +
  '  *set royal_his "her"\n' +
  '  *set royal_she "she"\n' +
  '  *set royals "princesses"\n' +
  '  *goto A\n' +
  '*else\n' +
  '  *set royal_him "him"\n' +
  '  *set royal_his "his"\n' +
  '  *set royal_she "he"\n' +
  '  *set royals "princes"\n' +
  '  *goto A\n' +
  '\n' +
  '*label A\n' +
  '\n' +
  'Ah, would you like to specify the color of your hide?  I wasn\'t sure which color to put in that description.\n' +
  '\n' +
  '*temp color\n' +
  '*choice\n' +
  '    #Can we just get on to the smashing?\n' +
  '        *set brutality %+ 30\n' +
  '        yes, of course!  Your wish is my command.\n' +
  '        \n' +
  '        On with the show!\n' +
  '        \n' +
  '        *page_break\n' +
  '        *goto RoyalResolution\n' +
  '    #Black.\n' +
  '        *set color "black"\n' +
  '        *goto limbs\n' +
  '    #Blue.\n' +
  '        *set color "blue"\n' +
  '        *goto limbs\n' +
  '    #Brown.\n' +
  '        *set color "brown"\n' +
  '        *goto limbs\n' +
  '    #Gold.\n' +
  '        *set color "golden"\n' +
  '        *goto limbs\n' +
  '    #Green.\n' +
  '        *set color "green"\n' +
  '        *goto limbs\n' +
  '    #Iridescent.\n' +
  '        *set color "iridescent"\n' +
  '        *goto limbs\n' +
  '    #Red.\n' +
  '        *set color "red"\n' +
  '        *goto limbs\n' +
  '    #White.\n' +
  '        *set color "white"\n' +
  '        *goto limbs\n' +
  '    \n' +
  '\n' +
  '*label limbs\n' +
  'Wonderful choice.  So the light glistened off your ${color} hide, as you snatched the ${royal} out of ${royal_his} tower.\n' +
  '\n' +
  'While we\'re on the subject, let\'s settle a few other details.  How many limbs will you have, not counting your wings or tail?\n' +
  '\n' +
  '*fake_choice\n' +
  '    #Four.\n' +
  '    #Five.\n' +
  '    #Six.\n' +
  '    #Eight.\n' +
  '\n' +
  'Hmm.  Is the top of your head ridged or smooth?\n' +
  '*temp head\n' +
  '\n' +
  '*choice\n' +
  '    #Ridged.\n' +
  '        *set head "ridged"\n' +
  '        *goto wings\n' +
  '    #Smooth.\n' +
  '        *set head "smooth"\n' +
  '        *goto wings\n' +
  '\n' +
  '*label wings\n' +
  '\n' +
  'I see.  And your wingsâ€”feathery, leathery, or scaly?\n' +
  '\n' +
  '*temp wings\n' +
  '\n' +
  '*choice\n' +
  '    #Feathery.\n' +
  '        *set wings "feathery"\n' +
  '        *goto Summary\n' +
  '    #Leathery.\n' +
  '        *set wings "leathery"\n' +
  '        *goto Summary\n' +
  '    #Scaly.\n' +
  '        *set wings "scaly"\n' +
  '        *goto Summary\n' +
  '\n' +
  '*label Summary\n' +
  'As you kidnapped the ${royal}, you beat your ${wings} ${color} wings and flew off into the night, as ${royal_she} clutched tightly to your ${head} scalp to avoid plummeting to ${royal_his} doom.\n' +
  '\n' +
  '*label RoyalResolution\n' +
  'What are you planning on doing with the ${royal}, anyway?\n' +
  '*choice\n' +
  '  #It\'s all about companionship and good conversation.\n' +
  '    Life can be lonely as a dragon, and interesting conversation is at a premium.  The elite upbringing of royalty makes them more suitable for entertaining dragons.\n' +
  '\n' +
  '    But what do you do after you tire of ${royal_his} conversation?\n' +
  '    *choice\n' +
  '      #Then it\'s time for a royal feastâ€”by which I mean I eat ${royal_him}.\n' +
  '        The ${royal}\'s efforts to entertain you with ${royal_his} stories, harp-playing, and singing become more desperate as your boredom becomes more apparent.  But even ${royal_his} best efforts are not enough, and you devour ${royal_him} without remorse.\n' +
  '\n' +
  '        *set brutality %+10\n' +
  '        *set cunning %+10\n' +
  '        *set infamy %+10\n' +
  '        *goto personality\n' +
  '\n' +
  '      #I let ${royal_him} slip away, pretending not to notice ${royal_his} escape plan.\n' +
  '        The ${royal} becomes gradually more fearful as ${royal_his} stories, harp-playing, and singing amuse you less each passing day.  One evening, as you pretend to sleep, ${royal_she} makes a break for it.  You are well aware of ${royal_his} departure and could catch ${royal_him} easily, but you let ${royal_him} go.  $!{Royal_She} made several months more interesting, and that\'s\n' +
  '        worth sparing ${royal_his} life.\n' +
  '        *set brutality %-10\n' +
  '        *set cunning %-10\n' +
  '        *set infamy %-10\n' +
  '        *goto personality\n' +
  '  #I\'ll keep ${royal_him} around for a little while to lure in more knights, but then ${royal_she}\'s dinner.  It\'s a little known fact that ${royals} taste better than most humans.\n' +
  '    *goto EatHer\n' +
  '  #It\'s all about the ransom payments.  Those are a quick and easy way to build a hoard.\n' +
  '    Indeed.  Within a month, a large chest of gold comes to pay for the ${royal}\'s release.\n' +
  '    *set wealth +1500\n' +
  '\n' +
  '    What do you do then?\n' +
  '    *choice\n' +
  '      #Honor demands that I carry out my end of the bargain.\n' +
  '        Of course.  No sooner have you received the payment than you let the ${royal} go.\n' +
  '        *set cunning %-20\n' +
  '        *set brutality %-10\n' +
  '        *set infamy %-10\n' +
  '        *goto personality\n' +
  '\n' +
  '      #Once I have the payment, I have no reason to delay my dinner.\n' +
  '        Crunch, munch.  Delicious.\n' +
  '\n' +
  '        *set cunning %+20\n' +
  '        *set brutality %+10\n' +
  '        *set infamy %+10\n' +
  '        *goto personality\n' +
  '    \n' +
  '*label EatHer\n' +
  'It must be the diet.  In any event, you have a delightful dinner of roast ${royal}.\n' +
  '*set brutality %+10\n' +
  '*set infamy %+10\n' +
  '*goto personality\n' +
  '\n' +
  '*label personality\n' +
  '\n' +
  '*page_break\n' +
  'This would be a good time to talk a little more about your personality.\n' +
  '\n' +
  'All dragons can be described in terms of a handful of characteristics, each in opposed pairs:  Brutality and Finesse, Cunning and Honor, Disdain and Vigilance.\n' +
  '\n' +
  '*comment We start with the basic dichotomies between the paired attributes\n' +
  '*comment brutality is the opposite of finesse; only modify by %+ or %-\n' +
  '\n' +
  'Are you more notable for your Brutality or your Finesse?\n' +
  '*choice\n' +
  '  #Brutality: strength and cruelty.\n' +
  '    *set brutality %+70\n' +
  '    *goto CunningQuestion\n' +
  '  #Finesse: precision and aerial maneuverability.\n' +
  '    *set brutality %-70\n' +
  '    *goto CunningQuestion\n' +
  '\n' +
  '*label CunningQuestion\n' +
  '\n' +
  '*comment cunning is the opposite of honorable; only modified by %+ or %-\n' +
  '\n' +
  'Do you have more Cunning or Honor?\n' +
  '*choice\n' +
  '  #Cunning: intelligence and trickery.\n' +
  '    *set cunning %+70\n' +
  '    *goto DisdainQuestion\n' +
  '  #Honor: honesty and trustworthiness.\n' +
  '    *set cunning %-70\n' +
  '    *goto DisdainQuestion\n' +
  '\n' +
  '*label DisdainQuestion\n' +
  '\n' +
  '*comment disdain is the opposite of vigilant; only modify by %+ or %-\n' +
  '\n' +
  'Do you disdain threats and insults that are beneath you, or are you vigilant\n' +
  'against any slight or transgression?\n' +
  '*choice\n' +
  '  #Disdain: patience and scorn.\n' +
  '    *set disdain %+70\n' +
  '    *goto FirstChoice\n' +
  '  #Vigilance: attention and impulsiveness.\n' +
  '    *set disdain %-70\n' +
  '    *goto FirstChoice\n' +
  '\n' +
  '*label FirstChoice\n' +
  '*comment Now we face some real choices to finish chargen and establish setting\n' +
  '*comment First choice trades off cunning vs. brutality\n' +
  'Now we\'re going to view some flashbacks to your days as a wyrmling.\n' +
  '\n' +
  'As a young hatchling, you lived with your mother in a cave high up on a mountain.  Your mother had a vast hoard of treasure and a varied hunting range. Some of your siblings chose to spend much of their time reading the rare codices and scrolls your mother had collected.  Other siblings spent their time hunting dangerous game and brawling with each other.  Which pursuit did you prefer?\n' +
  '\n' +
  '*choice\n' +
  '  #Reading.\n' +
  '    A wise choice that made you more Cunning and taught you Finesse.\n' +
  '    *set cunning %+20\n' +
  '    *set brutality %-20\n' +
  '    *goto SecondChoice\n' +
  '  #Hunting.\n' +
  '    You developed your muscles as you gloried in combat and the kill at\n' +
  '    the end of the hunt.  Your brawls with your siblings also taught you the\n' +
  '    basics of Honor. \n' +
  '\n' +
  '    Brutality and Honor increase.\n' +
  '    *set cunning %-20\n' +
  '    *set brutality %+20\n' +
  '    *goto SecondChoice\n' +
  '\n' +
  '*label SecondChoice\n' +
  '*comment Second choice trades off cunning vs. disdain\n' +
  '\n' +
  'As you reached maturity, you began to threaten your mother\'s dominance over her territory.  Before you could possibly have bested her in a direct confrontation, she threw you out of her lair and drove you from the lands in which you grew up, leaving you to fend for yourself without any resources beyond your claws, wings, and teeth. \n' +
  '\n' +
  'Did you seek revenge on her by turning some of the humans in her lands against her, or did you consider petty revenge beneath you?\n' +
  '\n' +
  '*choice\n' +
  '  #I sought revenge.\n' +
  '    You were unable to truly threaten her, but you forced your mother to\n' +
  '    spend her time suppressing the revolts of human villages.  The dead    \n' +
  '    villagers also provided her with no tribute, reducing the increase of her\n' +
  '    hoard.  Perhaps something more direct would be better as revenge. Still, a real\n' +
  '    gain nonetheless. \n' +
  '\n' +
  '    Cunning and Vigilance increase.\n' +
  '    *set cunning %+20\n' +
  '    *set disdain %-20\n' +
  '    *goto ThirdChoice\n' +
  '  #Revenge is beneath my dignity.\n' +
  '    Disdain for petty matters is essential for a dragon, as it avoids the\n' +
  '    pointless feuds that weaken you and allow your enemies to achieve great\n' +
  '    goals. \n' +
  '   \n' +
  '    Manipulating peasants is also not the most honorable of activities for a    \n' +
  '    mighty dragon such as yourself. \n' +
  '   \n' +
  '    Your wise choice increases Disdain and Honor.\n' +
  '    *set cunning %-20\n' +
  '    *set disdain %+20\n' +
  '    *goto ThirdChoice\n' +
  '\n' +
  '*label ThirdChoice\n' +
  '*comment Trades off Disdain versus Brutality\n' +
  '\n' +
  'After several days of flight, you came across a tiny halfling travelling through the desert.  Even from afar, your keen eyes detected the glint of gold and the sparkle of magic.  This halfling has some sort of magic golden shield strapped to his tiny back.\n' +
  '\n' +
  'You knew immediately that this treasure must be yours.\n' +
  '\n' +
  'The halfling was far from civilization and would almost surely die soon of thirst and starvation.  For the moment, he seemed to be protected by the power of the shield.\n' +
  '\n' +
  'Did you kill him on the spot, ignoring his magical protections, or did you hover nearby and wait for the halfling to die, knowing that you might lose the treasure?\n' +
  '\n' +
  '*choice\n' +
  '  #I waited for him to die.\n' +
  '    There\'s no reason you have to do all the dirty work yourself.  A few hours later, the halfling stumbled, crawled for a while, and finally stopped.  You easily plucked the treasure off of his body, saving yourself quite a bit of work.\n' +
  '   \n' +
  '    Disdain and Finesse increase.\n' +
  '    *set brutality %-20\n' +
  '    *set disdain %+20\n' +
  '    *goto Axilmeus\n' +
  '  #I killed him on the spot.\n' +
  '    It wasn\'t easy; the shield protected him from fire and helped him evade your attacks.  Eventually you had to swallow him whole and cough up the shield.  That worked!\n' +
  '   \n' +
  '    Brutality and Vigilance increase.\n' +
  '    *set brutality %+20\n' +
  '    *set disdain %-20\n' +
  '    *goto Axilmeus\n' +
  '\n' +
  '*label Axilmeus\n' +
  '*page_break\n' +
  'One of your elder clutchmates was an overbearing brute named Axilmeus.  Axilmeus loved to torment the others, always seeking to seize what did not belong to him.\n' +
  '\n' +
  '"${name}," he said with a menacing grin, "give me that golden shield, or I will beat you within an inch of your life."\n' +
  '\n' +
  '*choice\n' +
  '  # I gave him the shield to avoid a fight.\n' +
  '    *set disdain %+ 15\n' +
  '    Disdain increases.\n' +
  '    \n' +
  '    Axilmeus took your shield and beat you with it, hard.\n' +
  '    *goto ResolveAxilmeus\n' +
  '  # I dueled him for the shield.\n' +
  '    *set brutality %+ 15\n' +
  '    *set cunning %- 15\n' +
  '    Brutality and Honor increase.\n' +
  '    \n' +
  '    You fought your hardest, but Axilmeus was a bit stronger than you; he pinned you to the ground and pried the shield out of your claws.\n' +
  '    *goto ResolveAxilmeus\n' +
  '  # I evaded him and hid the shield.\n' +
  '    *set brutality %- 15\n' +
  '    *set cunning %+ 15\n' +
  '    Cunning and Finesse increase.\n' +
  '  \n' +
  '    Unfortunately, Axilmeus is your elder; at this age, he has the advantage in maneuverability.  He caught up to you quickly, pinning you to the ground and prying the shield out of your claws.\n' +
  '    *goto ResolveAxilmeus\n' +
  '\n' +
  '*label ResolveAxilmeus\n' +
  'Then he crushed the shield in his jaws, wasting the magical energies imbued within it, and spat it out at your feet.  He laughed with a great roar as he flew away.\n' +
  '\n' +
  '*label Wrapup\n' +
  '*comment [We need to generate a starting Wealth somehow.  My current thought is\n' +
  '*comment that we use a random number increased up by low Brutality, low Disdain,\n' +
  '*comment and high Cunning. \n' +
  '*comment But we could also tie it more specifically to the choices, or just go\n' +
  '*comment random, or whatever.]\n' +
  '\n' +
  '*page_break\n' +
  '\n' +
  'You have the following stats:\n' +
  '\n' +
  '*temp wealth_text "${wealth} gold coins"\n' +
  '\n' +
  '*stat_chart\n' +
  '  opposed_pair Brutality\n' +
  '    Brutality\n' +
  '    Finesse\n' +
  '  opposed_pair Cunning\n' +
  '    Cunning\n' +
  '    Honor\n' +
  '  opposed_pair Disdain\n' +
  '    Disdain\n' +
  '    Vigilance\n' +
  '  percent Infamy\n' +
  '  text wealth_text Wealth\n' +
  '\n' +
  '*finish Begin the Adventure';
