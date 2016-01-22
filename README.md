# qitalk
qimessaging.js framework on Pepper

# Dependencies

- qimessaging.js v2.0+
- jQuery

# Functions

- cache services
- view html templete
- switch html templete on single page

# Usage

### Example

- index.html
```html
<script src="/lib/jquery/jquery.min.js"></script>
<script src="/libs/qimessaging/2/qimessaging.js"></script>
<script src="js/qitalk.js"></script>
<script>
$(function() {
   Qitalk.init({
     host    : '', // pepper host. default => localhost
     root    : '#qitalk',
     tplDir  : './tpl',
     preload : {
       tpl     : ['home', 'profile'],
       service : ['ALMemory', 'ALTextToSpeech']
     },
     handle : {
       start : function() {
         Qitalk.presentView('home'); // switch html templete.
       }
     }
   });
});
</script>
<body>
   <div id="qitalk">
   </div>
</body>
```

- ./tpl/home.tpl

```html
<script>
$(function() {
  $("#nextpage").on('click', function() {
    var username = $("input['name=username']").val();
    Qitalk.presentView('profile', username); // send value for next page.
  });
});
</script>
<input type="text" name="username" />
<input id="nextpage" type="button" value="go to profile page.">
```

- ./tpl/profile.tpl

```html
<script>
var params = Qitalk.params; // get value for prev page.
$(function() {
  $("#username").text(params);
});
</script>
<p id="username"></p>
```

### How to call services

It must cache service.
```javascript
///
preload : {
       tpl     : ['home', 'profile'],
       service : ['ALMemory', 'ALTextToSpeech']
},
///
```

Service is called from Qitalk.proxy property.
```javascript
Qitalk.proxy.ALTextToSpeech.say('I am pepper');
```

### Wrap qimessaging APIs

- Qitalk.subscriber(name, function) // Recive signal to tablet from pepper.
- Qitalk.raiseEvent(name, value) // Send signal to pepper from tablet.





