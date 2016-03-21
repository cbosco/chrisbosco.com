---
title: "Rails: Authenticate with EmberJS"
template:   post.ejs
Date: 2013-06-04
filename: Rails-Authenticate-with-EmberJS.html
Tags: JavaScript, EmberJS, Ruby, Rails, Authentication
Abstract: Completely client-side user creation and sign in with Ember.js and Rails
---

## [Get the ember-rails gem](https://github.com/emberjs/ember-rails)

This guide assumes Ember is [bootstrapped and installed](https://github.com/emberjs/ember-rails#getting-started).

## Before getting started with authentication

### A required environment config (bug?)

Before getting started with Ember, as of this writing, [there is a bug](https://github.com/emberjs/ember-rails/issues/64) wherein specifying an Ember variant in your environment config is **REQUIRED**. So, be sure to manually include the appropriate variant.  

For example, in `config/environments/development.rb` add the line:

	config.ember.variant = :development
	
Rinse, repeat for `:production`, `:test`, etc.

### Update Ember

The version that came with my gem was a bit outdated so follow the guide to pull down the latest from master and check it into `/vendor`.

	rails generate ember:install --head
	
P.S. Restart your server after this. Don't make the same mistake I did.

### Remove Ember Data API revision from the `Store`

[As of 0.13 this became deprecated](http://emberjs.com/blog/2013/05/28/ember-data-0-13.html).  This would be in `app/assets/javascripts/store.js.coffee`.
	
### LOG_TRANSITIONS

Add a helpful transition logger in `application.js`:

	App = Ember.Application.create({
	    LOG_TRANSITIONS: true
	});

*As of July there is an official Ember [debugging guide](http://emberjs.com/guides/understanding-ember/debugging/).*

## Onto Authentication!

With a brand new app, I recommend following the [Authentication From Scratch RailsCast](http://railscasts.com/episodes/250-authentication-from-scratch) with bcrypt. ([Transcript](http://asciicasts.com/episodes/250-authentication-from-scratch
))

After Ember is bootstrapped, the generators you run through the railscast tutorial should build corresponding JavaScript.

### Intermission...

Still there? Awesome.


### JavaScript file location shorthand

To clarify, any client-side work starts in the path `/app/assets/javascripts` and I will be omitting that for the most part.

## First Handlebars templates


Create the **application** Handlebars template (`templates/application.hbs`). This is like the server-side `application.html.erb` template in `app/views/layouts`. Note the `{{outlet}}` -- this is where other templates appear. Similar to `<%= yield %>` in erb on the server.

templates/application.hbs

	<h2>Hello world</h2>
	<div>	
	    {{outlet}}
	</div>

We can also create an **index** template while we are at it at, which can serve as our welcome page.

templates/index.hbs

	<h1>Welcome to my App!</h1>



## Creating users

### Create the model first

The **User** model is a little simpler than the server-side one. We just need `string` attributes for anything we need to submit to the server.

models/user.js.coffee

	App.User = DS.Model.extend
	    email:  DS.attr('string')
	    password:  DS.attr('string')
	    passwordConfirmation:  DS.attr('string')


### Followed by route(s)

To me, an Ember application's essence is its router.

Let's map Users as a resource with a **new** route:

router.js.coffee

	App.Router.map (match)->
	    @resource('users', ->
	        @route('new')
	    )

Unlike in Rails, you have to explicitly map the **new** route, even though you have used the `resource` method.

And now we can define the **new** route in its own file.

routes/users_new_route.js.coffee

	App.UsersNewRoute = Ember.Route.extend({
	    model: ->
	        App.User.createRecord()
	    events:
	        save: ->
	            @content.save()
	                .then =>
	                    @transitionToRoute('index')
	        cancel: ->
	            @content.deleteRecord()
	            @transitionToRoute('index')
	})

Note first that `createRecord()` does not do any HTTP communication -- it is akin to `new` on a Rails ActiveRecord model and just sets up a resource in memory.

Since we are not yet deviating from the auto-generated Ember controller logic, there is no need to customize that layer yet. We can handle our events at the router level, as they mostly involve simple redirection anyway.

There are two events we plan to handle here: **save** and **cancel**.  

In the case of save, we call the `save()` method on the User model, which follows a promise API. When validation succeeds, you continue into the `then` case.

Cancel simply cleans up the User we created in memory when we first loaded this route.

### …and template(s)

First off, once you have mapped this route you can link to it in your application template:

templates/application.hbs

	...
	{{#linkTo users.new }}
	    Sign Up
	{{/linkTo}}
	...

And now we add the new User form:

templates/users/new.hbs

	<form {{action save on="submit"}}>
	    <div class="control-group" {{bindAttr class="errors.email:error"}}>
	        <label for="user-email">Email</label>
	        {{view Ember.TextField valueBinding="email" id="user-email" required="true"}}
	        <span class="help-inline">
	            {{errors.email}}
	        </span>
	    </div>
	    <div class="control-group" {{bindAttr class="errors.password:error"}}>
	        <label for="user-password">Password</label>
	        {{view Ember.TextField valueBinding="password" type="password" id="user-password" required="true"}}
	        <span class="help-inline">
	            {{errors.password}}
	        </span>
	    </div>
	    <div class="control-group" {{bindAttr class="errors.passwordConfirmation:error"}}>
	        <label for="user-password-confirmation">Password confirmation</label>
	        {{view Ember.TextField valueBinding="passwordConfirmation" type="password" id="user-password-confirmation" required="true"}}
	        <span class="help-inline">
	            {{errors.passwordConfirmation}}
	        </span>
	    </div>
	    <button type="submit">Join</button>
	    <a {{action cancel}}>Cancel</a>
	</form>

What may seem complicated is basically a lot of markup giving us meaningful error states. The **save**  event (action) is bound to the form submission, and **cancel** is bound to an anchor tag.

### The right server response

At this point you probably want to test this out, but we shuold make sure our Rails application responds in just the RESTful way Ember expects it to with its REST adapter. (That is, if you want to write the least code possible!)

There are two overarching rules here.

1. When responding successfully with JSON data, always name your resource. In our case this means the User JSON should be within a key called `user` at the highest level in the parsed JSON tree. 
2. When responding to an unsuccessful query with errors as JSON, name these `errors`!

Finally, we can use a helpful Rails method called `respond_to` which forks our server response between HTML (traditional Rails site) and JSON (RESTful API communicating with Ember client).

Back to the Rails code, let's update the `users#create` action accordingly.

/app/controllers/user_controller.rb

	class UsersController < ApplicationController
	
		...
	
	    def create
	        @user = User.new params[:user]
	        if @user.save
	            respond_to do |format|
	                format.html { redirect_to :root, notice: "Signed up!" }
	
	                format.json { render json: { user: @user.as_json(only: :email) }, status: :created }
	            end
	        else
	            respond_to do |format|
	                format.html { render :new }
	                format.json { render json: { errors: @user.errors }, status: :unprocessable_entity }
	            end
	        end
	    end
	end

By now you should be able to successfully create a new User.

## Creating sessions

### Create the model first

For the model, follow the pattern for User.

The **User** model is a little simpler than the server-side one. We just need `string` attributes for anything we need to submit to the server.

models/session.js.coffee

	App.Session = DS.Model.extend
	    email: DS.attr('string')
	    password: DS.attr('string')	

### Followed by route(s)

Let's map the sessions/new (log in) and sessions/destroy (log out)

router.js.coffee
	
	App.Router.map (match)->
	    @resource('users', ->
	        @route('new')
	    )
	    @resource('sessions', ->
	        @route('new')
	    )

We will handle two similar events once again: **save** and **cancel**.  

routes/sessions_new_route.js.coffee

	App.SessionsNewRoute = Ember.Route.extend(
	    needs: ['currentUser']
	
	    model: ->
	        App.Session.createRecord()
	
	    events:
	        save: ->
	            @controller.content.save()
	                .then =>
	                    @transitionTo('index')
	
	        cancel: ->
	            @controller.content.deleteRecord()
	            @transitionTo('index')
	)



### …and template(s)

Let's update the application template with a link to the Login form:

templates/application.hbs

	...
	{{#linkTo users.new}}Sign Up{{/linkTo}} |
	{{#linkTo sessions.new}}Login{{/linkTo}}
	...

And now we add the the new Session (a.k.a. Login) form, similar to that for the user:

templates/sessions/new.hbs

	<form {{action save on="submit"}}>
	    <div class="control-group" {{bindAttr class="errors.email:error"}}>
	        <label for="user-email">Email</label>
	        {{view Ember.TextField valueBinding='email' id="user-email" required="true"}}
	        <span class="help-inline">
	            {{errors.email}}
	        </span>
	    </div>
	    <div class="control-group" {{bindAttr class="errors.password:error"}}>
	        <label for="user-password">Password</label>
	        {{view Ember.TextField type="password" valueBinding='password' id="user-password" required="true"}}
	    </div>
	    <button type="submit">Login</button>
	    <a {{action cancel}}>Cancel</a>
	</form>




## The right server response (again)

Before testing we need to update the way Sessions work on the Rails site. Although we don't have a model we need to update our controller and Sessions HTML form from the authentication example to work a little more like standard Rails resources.

Specifically, instead of passing discrete `:email` and `:password` params to log in, we should pass a `:session` params object as if we had posted from a `form_for` a Session resource. While we're at it, let's make sure these routes, like those in the User controller, respond with JSON.

Finally, the resource returned from session creation should actually be a User and not a Session, in order for us to have the notion of a currentUser in Ember (the final thing to implement). However, the User data is labeled as Session in the JSON to keep with the convention in the route. For example:

	{"session":{"email":"me@example.com"}}

/app/views/sessions/new.html.erb

	<h1>Sign in</h1>
	<%= form_tag sessions_path do %>
	    <p>
	        <%= label_tag '[session][email]', 'Email' %>
	        <%= text_field_tag '[session][email]', (params[:session][:email] unless params[:session].nil?) %>
	    </p>
	    <p>
	        <%= label_tag '[session][password]', 'Password' %>
	        <%= password_field_tag '[session][password]' %>
	    </p>
	    <%= submit_tag %>
	<% end %>


/app/controllers/sessions_controller.rb

    def create
        user = User.authenticate params[:session]
        if user
            session[:user_id] = user.id

            respond_to do |format|
                format.html { redirect_to :root, notice: "Logged in!" }
                format.json { render json: { session: user.as_json(only: :email) }, status: :created }
            end
        else

            respond_to do |format|
                format.html {
                    flash.now.alert = "Invalid email or password"
                    render :new
                }
                format.json { render json: { errors: {email: "Invalid email or password"} }, status: :unprocessable_entity }
            end
        end
    end




## current_user? How about currentUser

Let's follow a [common pattern](http://say26.com/using-rails-devise-with-ember-js) of using a singleton controller for this.

controllers/current_user_controller.js.coffee

	App.CurrentUserController = Ember.ObjectController.extend(
	    isSignedIn: (->
	        @get('content') && @get('content').get('isLoaded')
	    ).property('content.isLoaded')
	)


### An initializer

We now want to prefill `currentUser` whenever the application initializes.

First, make sure initializers are in your manifest in your application's js file/manifest.

app.js

	#= require ./store
	#= require_tree ./initializers
	#= require_tree ./models
	#= require_tree ./controllers
	#= require_tree ./views
	#= require_tree ./helpers
	#= require_tree ./templates
	#= require_tree ./routes
	#= require ./router
	#= require_self

Now write the initializer. This type of [initializer](http://nerdyworm.com/blog/2013/04/03/ember-initializers/) pre-fetches some data before your app is completely initialized.


initializers/current_user.js.coffee

	Ember.Application.initializer(
	    name: 'currentUser'
	    after: 'store'
	
	    initialize: (container) ->
	        store = container.lookup('store:main')
	        user = App.User.find('current')
	        container.lookup('controller:currentUser').set('content', user)
	        container.typeInjection('controller', 'currentUser', 'controller:currentUser')
	)

Note the `after: 'store'` line to ensure the store is initialized before we operate on it. This is usually the case but it doesn't hurt to be 100% sure.

### Route update

Let's update the `SessionsNewRoute` to set `currentUser` when successfully logging in.

routes/sessions_new_route.js.coffee

	App.SessionsNewRoute = Ember.Route.extend(
	    needs: ['currentUser']
	
	    model: ->
	        App.Session.createRecord()
	
	    events:
	        save: ->
	            @controller.content.save()
	                .then =>
	                    userJSON = @controller.content.toJSON()
	                    userJSON.id = 'current'
	                    object = @store.load(App.User, userJSON)
	                    user = App.User.find('current')
	
	                    @controllerFor('currentUser').set('content', user)
	                    @transitionTo('index')
	
	        cancel: ->
	            @controller.content.deleteRecord()
	            @transitionTo('index')
	)

Note the new dependency on `currentUser` via the `needs` key.

	    needs: ['currentUser']
 

### Use it to add logic to your sign up / log in links

Now we can use our notion of the currently logged-in user to update the links in our navigation.

templates/application.hbs
	
	...
	{{#if currentUser.isSignedIn}}
	    Logged in as {{currentUser.email}}
	{{else}}
	    {{#linkTo users.new}}Sign Up{{/linkTo}} |
	    {{#linkTo sessions.new}}Login{{/linkTo}}
	{{/if}}
	...


### The right server response (final pass)

The initializer is going to make a request to the `users/current` path in your application. We can anticipate this by adding a CRUD route for the `show` action.

/config/routes.rb

    resources :users, only: [:new, :create, :show]


/app/controllers/users_controller.rb

    def show
        @user = current_user
        unless @user.nil?
            respond_to do |format|
                format.html
                format.json { render json: { user: @user.as_json(only: :email) } }
            end
        else
            respond_to do |format|
                format.html
                format.json { render json: { }, status: :accepted }
            end
        end
    end

## Ok, one last thing

We need a way to log out. Let's create a `sessions.destroy` route.

First, complete our router map.

router.js.coffee
	
	App.Router.map (match)->
	    @resource('users', ->
	        @route('new')
	    )
	    @resource('sessions', ->
	        @route('new')
	        @route('destroy')
	    )

Now the route we create will run some code on the `enter` hook (as soon as it is entered). We unset `currentUser` and make a `GET` call to the server followed by a `DELETE` on the sessions resource to complete the logging out on the server.

routes/session_destroy_route.js.coffee
	    
	App.SessionsDestroyRoute = Ember.Route.extend(
	    enter: ->
	        controller = @controllerFor('currentUser');
	        controller.set('content', undefined);
	
	        App.Session.find('current')
	            .then (session) ->
	                session.deleteRecord()
	                controller.store.commit()
	
	        @transitionTo('index')
	)


### Update navigation links

We can add a link to this new route in our `application.hbs` layout template.

templates/application.hbs
	
	...
	{{#if currentUser.isSignedIn}}
	    Logged in as {{currentUser.email}}
	    ({{#linkTo sessions.destroy}}Logout{{/linkTo}})
	{{else}}
	    {{#linkTo users.new}}Sign Up{{/linkTo}} |
	    {{#linkTo sessions.new}}Login{{/linkTo}}
	{{/if}}
	...

### One last update to the Rails API

In order to support the two server calls we should return `current_user` whenever `sessions/current` (or anything, for that matter) is requested, so we add this to the `show` action.

/app/controllers/sessions_controller.rb

    def show
        respond_to do |format|
            format.html
            format.json { render json: { session: current_user }, status: :accepted }
        end
    end
    
Then to completely support the `DELETE` of the session, we need a familiar JSON response at the `destroy` action. No data is required; just a simple accepted response.

/app/controllers/sessions_controller.rb

    def destroy
        session[:user_id] = nil

        respond_to do |format|
            format.html { redirect_to :root, notice: "Logged out!" }
            format.json { render json: {}, status: :accepted }
        end
    end

## You're done!

You should be able to create users, log them in and log them out all within the context of your single-page Ember application.

## A working example

I have these steps put together in a [working Rails app](https://github.com/cbosco/tickets-together/tree/just_authentication) that hopefully answers any remaining questions (Nothing like working code!)

## Thanks

A great deal of this guide is adapted from [Playing with Ember.js and Devise](http://pivotallabs.com/playing-with-ember-js-and-devise/) which walks through a similar set up on top of the [Devise](https://github.com/plataformatec/devise) authentication gem. 

