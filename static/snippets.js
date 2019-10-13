// Handlers for the user_snippets.html template.
$(function() {
    // A User Snippet class constructor to be called on each
    // `.user-snippet-form`. Handles a bunch of side-effects and adds event
    // listeners to form children within the constructor.
    function Snippet($parentForm) {
        this.$el = $parentForm;

        // Child elements of the parent form.
        // We use "secret" instead of "private" because "private" is reserved.
        this.$markdownInput =     $parentForm.find("input[name=is_markdown]");
        this.$noneTag =           $parentForm.find(".snippet-tag-none");
        this.$preview =           $parentForm.find(".snippet-preview-container");
        this.$textareaContainer = $parentForm.find(".snippet-edit-container");
        this.$previewText =       $parentForm.find(".snippet-preview");
        this.$saveButton =        $parentForm.find(".save-button");
        this.$secretInput =       $parentForm.find("input[name=private]");
        this.$secretTag =         $parentForm.find(".snippet-tag-private");
        this.$textarea =          $parentForm.find("textarea");
        this.$undoButton =        $parentForm.find(".undo-button");

        // Creating variables for access within functions
        var preview = this.$preview;
        var textareaContainer = this.$textareaContainer;
        var textarea = this.$textarea;

        // Child element collections.
        this.$buttons = this.$saveButton.add(this.$undoButton);
        this.$inputs =
            this.$markdownInput.add(this.$secretInput).add(this.$textarea);

        // Internal state of the Snippet.
        // Matches the initial Snippet values to allow undo and dirty checks.
        this.oldState = {};
        // Holds the current Snippet values. We'll initialize it soon...
        this.state = {
            content: null,
            markdown: null,
            secret: null,
        };

        this.$preview.click(function() {
            textareaContainer.show();
            preview.hide();
            textarea.focus();
        });

        this.$textarea.keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){

              value = textarea.val();
              // to get the position of the cursor
              index = textarea.getCursorPosition();
              // select all from the starting point to the cursor position
              str_start = value.substring(0, index);
              // get end
              str_end = value.substring(index, value.length);
              // split the str with a line break
              splt = str_start.split('\n');
              // then finally to get your last line
              lastLine = splt[splt.length - 1].trim();
              // check first 2 characters
              lineStart = lastLine.substring(0,2);

              switch (lineStart) {
                case "* ":
                  event.preventDefault();
                  textarea.val(str_start + "\n* " + str_end);
                  textarea.selectRange(index + 3);
                  break;
                case "- ":
                  alert("dash");
                  break;
              }

            }
        });

        // Attach event listeners.
        // Internal state should be kept up-to-date with our inputs.
        this.$textarea.on("keyup change", (function() {
            this.state.content = this.$textarea.val();
        }).bind(this));
        this.$markdownInput.on("change", (function() {
            this.state.markdown = this.$markdownInput.prop("checked");
        }).bind(this));
        this.$secretInput.on("change", (function() {
            this.state.secret = this.$secretInput.prop("checked");
        }).bind(this));

        // Pull our initial input values into internal state.
        this.$inputs.trigger("change");

        // Re-render whenever an input changes.
        this.$inputs.on("keyup change", this.render.bind(this));

        // Save and undo buttons, available when state is dirty.
        this.$undoButton.on("click", this.undo.bind(this));
        this.$saveButton.on("click", this.submit.bind(this));

        // Finally, save (this also triggers a render).
        this.save();
    }

    // Save the internal state of a Snippet to allow undos.
    Snippet.prototype.save = function(e) {
        e && e.preventDefault && e.preventDefault();
        // Save the current values into .data.
        this.oldState.content = this.state.content;
        this.oldState.markdown = this.state.markdown;
        this.oldState.secret = this.state.secret;

        // Disable the buttons.
        this.render();
    };

    // Recover the original values from `this.oldState`.
    Snippet.prototype.undo = function(e) {
        e && e.preventDefault && e.preventDefault();
        this.$textarea.val(this.oldState.content);
        this.$markdownInput.prop("checked", this.oldState.markdown);
        this.$secretInput.prop("checked", this.oldState.secret);

        // HACK: Reset internal state and disable the buttons.
        this.$inputs.trigger("change");

        console.log("undo");
        this.$textareaContainer.hide();
        this.$preview.show();
    };

    // Check if a snippet is "dirty", meaning its initial state no-longer
    // matches the values of all its inputs.
    Snippet.prototype.checkIfDirty = function() {
        return (
            this.state.content !== this.oldState.content ||
            this.state.markdown !== this.oldState.markdown ||
            this.state.secret !== this.oldState.secret
        );
    };

    // Run some side-effects on the Snippet's elements. This could be diffed,
    // but it seems to run well enough as-is.
    Snippet.prototype.render = function() {
        var isDirty = this.checkIfDirty();

        this.$el.toggleClass("dirty", isDirty);
        // this.$buttons.prop("disabled", !isDirty);
        this.$noneTag.toggle(!this.state.content);
        this.$previewText.html(this.state.markdown ?
            window.marked(this.state.content) : this.state.content);
        this.$secretTag[this.state.secret ? "show" : "hide"]();
        this.$previewText.toggleClass("snippet-text-markdown",
            this.state.markdown);
        this.$previewText.toggleClass("snippet-text", !this.state.markdown);
    };

    // Catch form submissions, submit and disable buttons.
    Snippet.prototype.submit = function(e) {
        e && e.preventDefault && e.preventDefault();

        console.log('submit');
        this.$textareaContainer.hide();
        this.$preview.show();

        $.post(this.$el.attr("action"), this.$el.serialize(),
            this.save.bind(this));
    };

    // Create a Snippet for each week shown.
    var snippets = $(".user-snippet-form").map(function() {
        return new Snippet($(this));
    }).get();

    // Confirm window closings :)
    $(window).on("beforeunload", function() {
        var numDirty = snippets.filter(function(snippet) {
            return snippet.checkIfDirty();
        }).length;

        if (numDirty) {
            var s = numDirty > 1 ? "s." : ".";
            var msg = "Hey!!! You have " + numDirty + " unsaved snippet" + s;
            return msg;
        }
    });

    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }

    $.fn.selectRange = function (start, end) {
        if (typeof end === 'undefined') {
            end = start;
        }
        return this.each(function () {
            if ('selectionStart' in this) {
                this.selectionStart = start;
                this.selectionEnd = end;
            } else if (this.setSelectionRange) {
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

});
