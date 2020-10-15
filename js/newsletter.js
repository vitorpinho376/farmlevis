var $formWrapper = $('#newsletter-form');
var $form = $formWrapper.find('form');
var $formSuccessBox = $('#newsletter-form-success');
var $submitButton = $form.find('.form-button');
var emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

function formSubmit(event) {
    try {
        event.preventDefault();
        var formData = {
            name: $form.find('.form-control[type="text"]').val().trim(),
            email: $form.find('.form-control[type="email"]').val().trim()
        };
        var allFieldsFilled = Object.keys(formData).every(function(field) {
            return !!formData[field];
        });

        $submitButton.text('Enviando...');

        if (!allFieldsFilled) throw new Error('Todos os campos são obrigatórios');
        if (!formData.email.match(emailValidationRegex)) throw new Error('Preencha um e-mail válido');
        if (!window.dito) throw new Error('dito is undefined');

        window.dito.identify({
            id: window.dito.generateID(formData.email),
            name: formData.name
        });

        setTimeout(function() {
            window.dito.track({
                action: 'cadastrou-newsletter',
                data: {
                    origem: 'landing-page-parceria-levis'
                }
            });
            $formWrapper.addClass('hidden');
            $formSuccessBox.removeClass('hidden');
        }, 2000);
    } catch (error) {
        console.error(`formSubmit -> error`, error);
        $submitButton.text('Cadastrar');
        Swal.fire({
            title: 'Houve um erro ao enviar os dados',
            text: error,
            icon: 'error',
            timer: 10000,
            confirmButtonText: 'ok',
            confirmButtonColor: '#2d5f93'
        });
    }
}

$(function() {
    $form.on('submit', formSubmit);
});
