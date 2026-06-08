
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'project',     label: 'Проектная документация' },
  { value: 'engineering', label: 'Инженерные схемы' },
  { value: 'ecology',     label: 'Экологическая документация' },
  { value: 'report',      label: 'Отчёты' },
  { value: 'normative',   label: 'Нормативы' },
  { value: 'science',     label: 'Научные материалы' },
  { value: 'other',       label: 'Прочее' },
]

export default function UploadDocumentPage() {
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory]     = useState('project')
  const [objectId, setObjectId]     = useState('')
  const [file, setFile]             = useState<File | null>(null)
  const [objects, setObjects]       = useState<any[]>([])
  const [status, setStatus]         = useState<'idle'|'uploading'|'success'|'error'>('idle')
  const [errorMsg, setErrorMsg]     = useState('')

  useState(function() {
    const supabase = createClient()
    supabase.from('objects').select('id, name').eq('is_public', true).order('name')
      .then(function({ data }) { if (data) setObjects(data) })
  })

  async function handleSubmit() {
    if (!title || !file) {
      setErrorMsg('Заполните название и прикрепите файл')
      return
    }

    setStatus('uploading')
    setErrorMsg('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path)

      const { error: dbError } = await supabase.from('documents').insert({
        title,
        description: description || null,
        category,
        object_id:   objectId || null,
        file_url:    urlData.publicUrl,
        file_name:   file.name,
        file_size:   file.size,
        file_type:   ext.toUpperCase(),
        uploaded_by: user?.id ?? null,
        status:      'pending',
        is_public:   false,
      })

      if (dbError) throw dbError

      setStatus('success')
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Ошибка загрузки')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#00D4AA', marginBottom: '8px' }}>
            Документ загружен
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
            Документ отправлен на модерацию. После проверки он появится в открытом доступе.
            Обычно это занимает до 24 часов.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link href="/documents" style={{ padding: '10px 20px', background: '#C9A84C', color: '#0A0A0F', borderRadius: '6px', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>
              К документам
            </Link>
            <button onClick={function() { setStatus('idle'); setTitle(''); setDescription(''); setFile(null) }}
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1E1E2E', borderRadius: '6px', color: '#6B7280', fontSize: '12px', cursor: 'pointer' }}>
              Загрузить ещё
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F0' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E', background: '#0D0D14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/documents" style={{ color: '#374151', fontSize: '11px', textDecoration: 'none' }}>← Документы</Link>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', margin: 0 }}>ЗАГРУЗИТЬ ДОКУМЕНТ</h1>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '14px', display: 'flex', gap: '10px' }}>
          <span>ℹ️</span>
          <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.6 }}>
            Документ будет проверен модератором с уровнем допуска У3+.
            После одобрения он появится в публичном доступе.
            Загружая документ вы подтверждаете что имеете право на его публикацию.
          </div>
        </div>

        <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.08em' }}>НАЗВАНИЕ ДОКУМЕНТА *</div>
            <input value={title} onChange={function(e) { setTitle(e.target.value) }}
              placeholder="Например: Генеральный план территории 2026"
              style={{ width: '100%', padding: '10px 12px', background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: '6px', color: '#E8E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.08em' }}>ОПИСАНИЕ</div>
            <textarea value={description} onChange={function(e) { setDescription(e.target.value) }}
              placeholder="Краткое описание содержимого документа..."
              rows={3}
              style={{ width: '100%', padding: '10px 12px', background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: '6px', color: '#E8E8F0', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.08em' }}>КАТЕГОРИЯ *</div>
              <select value={category} onChange={function(e) { setCategory(e.target.value) }}
                style={{ width: '100%', padding: '10px 12px', background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: '6px', color: '#E8E8F0', fontSize: '12px' }}>
                {CATEGORIES.map(function(c) {
                  return <option key={c.value} value={c.value}>{c.label}</option>
                })}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.08em' }}>ОБЪЕКТ</div>
              <select value={objectId} onChange={function(e) { setObjectId(e.target.value) }}
                style={{ width: '100%', padding: '10px 12px', background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: '6px', color: '#E8E8F0', fontSize: '12px' }}>
                <option value="">Общий документ</option>
                {objects.map(function(obj) {
                  return <option key={obj.id} value={obj.id}>{obj.name}</option>
                })}
              </select>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.08em' }}>ФАЙЛ *</div>
            <div style={{
              border: '2px dashed #2A2A3E', borderRadius: '8px', padding: '24px',
              textAlign: 'center', cursor: 'pointer',
              background: file ? 'rgba(0,212,170,0.05)' : 'transparent',
              borderColor: file ? '#00D4AA' : '#2A2A3E',
            }}
              onClick={function() { document.getElementById('file-input')?.click() }}>
              <input id="file-input" type="file" style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg"
                onChange={function(e) { setFile(e.target.files?.[0] ?? null) }} />
              {file ? (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontSize: '13px', color: '#00D4AA', fontWeight: 600 }}>{file.name}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} МБ
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.3 }}>📁</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Нажмите чтобы выбрать файл</div>
                  <div style={{ fontSize: '10px', color: '#374151' }}>PDF, DOC, DOCX, XLS, XLSX, DWG, PNG, JPG</div>
                </div>
              )}
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', fontSize: '12px', color: '#FCA5A5' }}>
              ❌ {errorMsg}
            </div>
          )}

          <button onClick={handleSubmit} disabled={status === 'uploading'}
            style={{
              padding: '13px', background: status === 'uploading' ? '#2A2A3E' : '#C9A84C',
              border: 'none', borderRadius: '8px', color: '#0A0A0F',
              fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em',
              cursor: status === 'uploading' ? 'wait' : 'pointer',
            }}>
            {status === 'uploading' ? 'ЗАГРУЖАЕТСЯ...' : 'ОТПРАВИТЬ НА МОДЕРАЦИЮ'}
          </button>
        </div>
      </div>
    </div>
  )
}
