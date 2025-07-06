'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { supabase, type Todo } from '@/lib/supabase'
import { toast } from 'sonner'

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
}

const categories = ['업무', '개인', '학습', '건강', '기타']

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedCategory, setSelectedCategory] = useState('업무')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  // Supabase에서 todos 데이터 불러오기
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching todos:', error)
        toast('데이터를 불러오는 중 오류가 발생했습니다.')
        return
      }

      setTodos(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (inputValue.trim() === '') return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: inputValue.trim(),
            priority: selectedPriority,
            category: selectedCategory,
            completed: false
          }
        ])
        .select()

      if (error) {
        console.error('Error adding todo:', error)
        toast('할 일 추가 중 오류가 발생했습니다.')
        return
      }

      if (data) {
        setTodos([...data, ...todos])
        setInputValue('')
        toast('할 일이 추가되었습니다!')
      }
    } catch (error) {
      console.error('Error:', error)
      toast('할 일 추가 중 오류가 발생했습니다.')
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)

      if (error) {
        console.error('Error toggling todo:', error)
        toast('할 일 상태 변경 중 오류가 발생했습니다.')
        return
      }

      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
      
      toast(todo.completed ? '할 일이 진행중으로 변경되었습니다!' : '할 일이 완료되었습니다!')
    } catch (error) {
      console.error('Error:', error)
      toast('할 일 상태 변경 중 오류가 발생했습니다.')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting todo:', error)
        toast('할 일 삭제 중 오류가 발생했습니다.')
        return
      }

      setTodos(todos.filter(t => t.id !== id))
      toast('할 일이 삭제되었습니다!')
    } catch (error) {
      console.error('Error:', error)
      toast('할 일 삭제 중 오류가 발생했습니다.')
    }
  }

  const updateTodoPriority = async (id: string, priority: 'low' | 'medium' | 'high') => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ priority })
        .eq('id', id)

      if (error) {
        console.error('Error updating priority:', error)
        toast('우선순위 변경 중 오류가 발생했습니다.')
        return
      }

      setTodos(todos.map(t => 
        t.id === id ? { ...t, priority } : t
      ))
      
      toast('우선순위가 변경되었습니다!')
    } catch (error) {
      console.error('Error:', error)
      toast('우선순위 변경 중 오류가 발생했습니다.')
    }
  }

  const clearCompleted = async () => {
    try {
      const completedTodos = todos.filter(t => t.completed)
      const ids = completedTodos.map(t => t.id)
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', ids)

      if (error) {
        console.error('Error clearing completed todos:', error)
        toast('완료된 할 일 삭제 중 오류가 발생했습니다.')
        return
      }

      setTodos(todos.filter(t => !t.completed))
      toast(`${completedTodos.length}개의 완료된 할 일이 삭제되었습니다!`)
    } catch (error) {
      console.error('Error:', error)
      toast('완료된 할 일 삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = currentFilter === 'all' || 
                         (currentFilter === 'active' && !todo.completed) ||
                         (currentFilter === 'completed' && todo.completed)
    return matchesSearch && matchesFilter
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const activeCount = totalCount - completedCount

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const todayTodos = todos.filter(todo => {
    const today = new Date()
    const todoDate = new Date(todo.created_at)
    return todoDate.toDateString() === today.toDateString()
  })

  const priorityStats = {
    high: todos.filter(todo => todo.priority === 'high' && !todo.completed).length,
    medium: todos.filter(todo => todo.priority === 'medium' && !todo.completed).length,
    low: todos.filter(todo => todo.priority === 'low' && !todo.completed).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            TaskFlow Pro 로딩 중...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  TaskFlow Pro
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  스마트한 할 일 관리 플랫폼
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {todayTodos.length}개 오늘 추가
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {activeCount}개 진행중
              </Badge>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Supabase 연결됨"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">전체 할 일</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">완료됨</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completedCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">진행중</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">높은 우선순위</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{priorityStats.high}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 할 일 추가 및 검색 */}
          <div className="lg:col-span-2">
            <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  새로운 할 일
                </CardTitle>
                <CardDescription>
                  오늘 해야 할 일을 추가하고 우선순위를 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="무엇을 해야 하나요?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white/50 dark:bg-gray-900/50"
                  />
                  <Button onClick={addTodo} disabled={!inputValue.trim()} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    추가
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">우선순위</label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/50 dark:bg-gray-900/50 text-sm"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">카테고리</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/50 dark:bg-gray-900/50 text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 검색 및 필터 */}
            <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-white/20 shadow-xl">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="할 일 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={currentFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setCurrentFilter('all')}
                      size="sm"
                    >
                      전체
                    </Button>
                    <Button
                      variant={currentFilter === 'active' ? 'default' : 'outline'}
                      onClick={() => setCurrentFilter('active')}
                      size="sm"
                    >
                      진행중
                    </Button>
                    <Button
                      variant={currentFilter === 'completed' ? 'default' : 'outline'}
                      onClick={() => setCurrentFilter('completed')}
                      size="sm"
                    >
                      완료
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 할 일 목록 */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    할 일 목록
                  </CardTitle>
                  {completedCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCompleted}
                      className="text-red-500 hover:text-red-700"
                    >
                      완료된 항목 삭제
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {filteredTodos.length === 0 ? '조건에 맞는 할 일이 없습니다' : 
                   `${filteredTodos.length}개의 할 일이 있습니다`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">
                      <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xl font-semibold mb-2">할 일이 없습니다</p>
                      <p className="text-sm opacity-75">새로운 할 일을 추가해보세요!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                          todo.completed
                            ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50'
                            : 'bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all ${
                              todo.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                            }`}
                          >
                            {todo.completed && (
                              <svg className="w-4 h-4 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-base ${
                                todo.completed 
                                  ? 'line-through text-gray-500 dark:text-gray-400' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {todo.title}
                              </span>
                              <Badge variant="outline" className={`text-xs ${priorityColors[todo.priority]}`}>
                                {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {todo.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(todo.created_at)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <select
                              value={todo.priority}
                              onChange={(e) => updateTodoPriority(todo.id, e.target.value as 'low' | 'medium' | 'high')}
                              className="text-xs p-1 border border-gray-300 dark:border-gray-600 rounded bg-white/50 dark:bg-gray-900/50"
                            >
                              <option value="low">낮음</option>
                              <option value="medium">보통</option>
                              <option value="high">높음</option>
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTodo(todo.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 - 통계 및 분석 */}
          <div className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  진행률
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>전체 진행률</span>
                    <span className="font-semibold">
                      {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 dark:text-red-400">높은 우선순위</span>
                    <Badge variant="destructive" className="text-xs">
                      {priorityStats.high}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">보통 우선순위</span>
                    <Badge variant="secondary" className="text-xs">
                      {priorityStats.medium}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600 dark:text-green-400">낮은 우선순위</span>
                    <Badge variant="outline" className="text-xs">
                      {priorityStats.low}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  오늘의 할 일
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {todayTodos.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    오늘 추가된 할 일
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Supabase 연결됨
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  모든 데이터가 클라우드에 안전하게 저장됩니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
