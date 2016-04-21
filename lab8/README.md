Chelsea Valente
Lab 8 - the semantic web

Well, that was a huge pain in the butt! It is hard to do a lot of work when there is not the best documentation out there. However, that being aside the point - this was a very challenging lab. The structure of dbpedia was hard to understand since it kept returning urls and I wasnt sure how to query on that - but thankfully with some digging, I found people who had similar questions to me. It was really cool seeing the rdfs properties in action like rdfs:comment automatically finding the information. I definitely think that once this gets build up more this is going to be a really amazing thing. 

Thank GOODNESS for that virtuoso query builder. I played with that thing for (and i am not kidding) hours upon hours. But having that allowed me to dig deeper and find ways to retrieve data back from the web in formats that I wanted. 

I am not sure if the "query" text field is what it is supposed to be, but I didnt want to just return boring url's with basic properties. I really wanted to do something fun that can retireve information- so I did do text fields but with a twist! I added the default queries just for fun to show the user the idea/gist of the way the information was to be retrieved. 

A fun fact: GROUP BY and DISTINCT dont really work if you want a very clean dataset...  I had to use the (SAMPLE(?name) as ?name) structure to make all of the subsequent fields a part of the ?film_title so that I really was able to distinctly gather and group by the film title. Without it I would get several of the same movie titles but with the actor's name in various languages. It was not something I was used to semantically but it worked out very well in the end! 

