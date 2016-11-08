/*
 * timeout-dialog.js v1.0.1, 01-03-2012
 * 
 * @author: Rodrigo Neri (@rigoneri)
 * 
 * (The MIT License)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. 
 */


/* String formatting, you might want to remove this if you already use it.
 * Example:
 * 
 * var location = 'World';
 * alert('Hello {0}'.format(location));
 */
String.prototype.format = function() {
  var s = this,
      i = arguments.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};
var startTime = new Date();

!function($) {
  $.timeoutDialog = function(options) {

    var settings = {
      timeout: 1200,
      countdown: 10,
      message: 'You can close this dialog box in {0} seconds',
      msg: 'empty msg',
      // question: 'Do you want to stay signed in?',
      // sign_out_button_text: 'No, Sign me out',
      // keep_alive_url: '/keep-alive',
      // logout_url: null,
      // logout_redirect_url: '/',
      // restart_on_yes: true,
      dialog_width: $(window).width()-100,
      dialog_height: $(window).height()-100,
    }    

    $.extend(settings, options);

    var TimeoutDialog = {
      init: function () {
        this.setupDialogTimer();
      }, 

      setupDialogTimer: function() {
        var self = this;
        window.setTimeout(function() {
           self.setupDialog();
        }, (settings.timeout - settings.countdown) * 1000);
      },

      setupDialog: function() {
        var self = this;
        self.destroyDialog();

        $('<div id="timeout-dialog">' + '<p id = msg>' + settings.msg + '</p>' + '<br' +
            '<p id="timeout-message">' + settings.message.format('<span id="timeout-countdown">' + settings.countdown + '</span>') + '</p>' + 
          '</div>')
        .appendTo('body')
        .dialog({
          modal: true,
          width: settings.dialog_width,
          height: settings.dialog_height,
          zIndex: 10000,
          closeOnEscape: false,
          draggable: false,
          resizable: false,
          dialogClass: 'timeout-dialog',
          beforeClose: function(){
            var now = new Date();
            if (now.getTime()- startTime.getTime() < 5000)
              return false;
            else
              return true;
            }
        });

        self.startCountdown();
      },

      destroyDialog: function() {
        if ($("#timeout-dialog").length) {
          $(this).dialog("close");
          $('#timeout-dialog').remove();
        }
      },

      startCountdown: function() {
        var self = this,
            counter = settings.countdown;

        this.countdown = window.setInterval(function() {
          counter -= 1;
          $("#timeout-countdown").html(counter);

          if (counter <= 0) {
            window.clearInterval(self.countdown);
            // self.signOut(false);
          }

        }, 1000);
      }
    };

    TimeoutDialog.init();
  };
}(window.jQuery);