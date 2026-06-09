.on(V.OneTapInternalEvents.LOGIN_SUCCESS, function(p: any) {
          V.Auth.exchangeCode(p.code, p.device_id)
            .then(function(d: any) {
              let url = '/api/auth/vk?'
              if (d.access_token) {
                url += 'token=' + encodeURIComponent(d.access_token) + '&user_id=' + d.user_id + '&email=' + encodeURIComponent(d.email || '')
              } else {
                url += 'code=' + encodeURIComponent(p.code) + '&device_id=' + encodeURIComponent(p.device_id)
              }
              window.location.href = url
            })
            .catch(function(e: any) { setError('Ошибка VK: ' + e.message) })
        })
