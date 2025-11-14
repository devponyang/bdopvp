"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

interface MemberFormState {
  familyName: string
  className: string
  score: string
}

const INITIAL_MEMBER_STATE: MemberFormState = {
  familyName: "",
  className: "",
  score: ""
}

export default function SolareTournamentApplyPage() {
  const [teamName, setTeamName] = useState("")
  const [leaderFamilyName, setLeaderFamilyName] = useState("")
  const [leaderDiscord, setLeaderDiscord] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [members, setMembers] = useState<MemberFormState[]>(
    Array.from({ length: 3 }, () => ({ ...INITIAL_MEMBER_STATE }))
  )
  const [notes, setNotes] = useState("")
  const [agreeRules, setAgreeRules] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editLookupTeamName, setEditLookupTeamName] = useState("")
  const [editLookupPassword, setEditLookupPassword] = useState("")
  const [editError, setEditError] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleMemberChange = (index: number, key: keyof MemberFormState, value: string) => {
    setMembers((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [key]: value
      }
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (loading) return
    setLoading(true)

    try {
      const payload = {
        teamName,
        leaderFamilyName,
        leaderDiscord,
        editPassword,
        members: members.map((member) => ({
          familyName: member.familyName,
          className: member.className,
          score: member.score ? Number(member.score) : undefined
        })),
        notes: notes || undefined,
        agreeRules
      }

      const res = await fetch("/api/solare-tournament/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "접수에 실패했습니다.")
      }

      setSuccessMessage("참가 신청이 접수되었습니다! 운영진 확인 후 개별 안내해드릴 예정입니다.")
      setTeamName("")
      setLeaderFamilyName("")
      setLeaderDiscord("")
      setEditPassword("")
      setMembers(Array.from({ length: 3 }, () => ({ ...INITIAL_MEMBER_STATE })))
      setNotes("")
      setAgreeRules(false)
    } catch (error) {
      console.error(error)
      setErrorMessage(error instanceof Error ? error.message : "접수 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = () => {
    setEditLookupTeamName("")
    setEditLookupPassword("")
    setEditError("")
    setShowEditModal(true)
  }

  useEffect(() => {
    if (searchParams?.get("mode") === "edit") {
      openEditModal()
    }
  }, [searchParams])

  const handleEditLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEditError("")
    setEditLoading(true)
    try {
      const res = await fetch("/api/solare-tournament/applications/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: editLookupTeamName,
          editPassword: editLookupPassword
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "신청서를 찾을 수 없습니다.")
      }

      setTeamName(data.teamName ?? "")
      setLeaderFamilyName(data.leaderFamilyName ?? "")
      setLeaderDiscord(data.leaderDiscord ?? "")
      setEditPassword(editLookupPassword)
      setMembers(
        Array.isArray(data.members) && data.members.length === 3
          ? data.members.map((m: MemberFormState) => ({
              familyName: m.familyName ?? "",
              className: m.className ?? "",
              score: m.score ? String(m.score) : ""
            }))
          : Array.from({ length: 3 }, () => ({ ...INITIAL_MEMBER_STATE }))
      )
      setNotes(data.notes ?? "")
      setShowEditModal(false)
      setSuccessMessage("작성했던 신청서 데이터를 불러왔습니다. 수정 후 다시 제출하면 업데이트됩니다.")
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "조회 중 오류가 발생했습니다.")
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <main className="bg-zinc-950 text-white min-h-screen pb-20">
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-[1490px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-wider text-blue-300">Application</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mt-3">
              BDOPVP-포냥이 Solare Tournament 2025 참가 신청
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              아래 양식을 작성해 제출하면 운영진이 확인 후 디스코드로 개별 연락을 드립니다.
              신청 정보는 대회 운영을 위한 용도로만 사용됩니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                2025년 12월 20일 치지직 생중계
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                3인 1팀 · 32팀
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                솔라레 시즌 점수 컷 적용
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 px-3 py-1 text-blue-200">
                BDOPVP-포냥이 디스코드 필수 참여
              </span>
            </div>
            <div className="mt-6 flex gap-2">
              <Link
                href="/solare-tournament"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
              >
                ← 대회 안내로 돌아가기
              </Link>
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-blue-500/40 text-blue-200 hover:bg-blue-500/10 transition-colors"
              >
                🔐 기존 신청서 수정하기
              </button>
              <Link
                href="https://discord.com/invite/mD37c4GEby"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-purple-500/40 text-purple-200 hover:bg-purple-500/10 transition-colors"
              >
                💬 디스코드 참여하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1490px] px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-[1490px] bg-gradient-to-br from-zinc-900/80 to-slate-900/70 border border-white/10 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">팀 기본 정보</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    팀명 <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value.slice(0, 6))}
                    placeholder="최대 6글자 팀명"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    maxLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    대표자 가문명 <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={leaderFamilyName}
                    onChange={(e) => setLeaderFamilyName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    대표자 디스코드 ID <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={leaderDiscord}
                    onChange={(e) => setLeaderDiscord(e.target.value)}
                    placeholder="예: ponyang#1234"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    maxLength={120}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    수정용 비밀번호 <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="나중에 신청 내용 수정 시 사용할 비밀번호"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    maxLength={100}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">잊지 않도록 별도로 보관해주세요.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">팀원 정보</h2>
              <p className="text-sm text-gray-400">
                솔라레 시즌 점수는 가장 최근 기록을 기준으로 입력해주세요. (숫자만)
              </p>
              {members.map((member, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">팀원 {index + 1}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        가문명 <span className="text-blue-300">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.familyName}
                        onChange={(e) => handleMemberChange(index, "familyName", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        maxLength={100}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        주 클래스 <span className="text-blue-300">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.className}
                        onChange={(e) => handleMemberChange(index, "className", e.target.value)}
                        placeholder="예: 가디언"
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        maxLength={30}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        솔라레 시즌 점수
                      </label>
                      <input
                        type="number"
                        value={member.score}
                        onChange={(e) => handleMemberChange(index, "score", e.target.value)}
                        placeholder="예: 1730"
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>


            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">추가 정보</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  메모 / 전달 사항 (선택)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="전달하고 싶은 내용을 자유롭게 작성해주세요."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  maxLength={2000}
                />
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4">
                <input
                  id="agreeRules"
                  type="checkbox"
                  checked={agreeRules}
                  onChange={(e) => setAgreeRules(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border border-blue-400 text-blue-500 focus:ring-blue-400"
                  required
                />
                <label htmlFor="agreeRules" className="text-sm text-gray-200 leading-relaxed">
                  참가 신청을 제출하면 BDOPVP-포냥이 Solare Tournament 2025 규정(현장 일정 준수, 경기
                  규칙, 부정행위 금지 등)에 모두 동의한 것으로 간주됩니다. 
                  연락이 닿지 않는 경우 참가가 취소될 수 있습니다.
                  <br />
                  <span className="text-blue-200">
                    또한 모든 참가자는 BDOPVP-포냥이 공식 디스코드 서버에 반드시 참여해야 합니다.
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                제출 후 24시간 내에 대표자 디스코드로 안내 메시지가 전달됩니다. 연락이 오지 않을 경우
                디스코드 서버에서 운영진에게 문의해주세요.
              </p>
              <p className="text-xs text-gray-500">
                문의:{" "}
                <Link
                  href="https://discord.com/invite/mD37c4GEby"
                  target="_blank"
                  className="text-blue-300 hover:text-blue-200 underline-offset-2 hover:underline"
                >
                  BDOPVP-포냥이 디스코드
                </Link>
              </p>
            </section>

            {errorMessage && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {successMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/solare-tournament"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 transition-colors"
              >
                대회 안내 보기
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:bg-blue-900"
              >
                {loading ? "제출 중..." : "참가 신청 제출"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">기존 신청서 불러오기</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-400">
              신청 당시 입력한 팀명과 수정용 비밀번호를 입력하면, 기존 신청 내용을 불러와 수정할 수 있습니다.
            </p>
            <form onSubmit={handleEditLookup} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  팀명
                </label>
                <input
                  type="text"
                  value={editLookupTeamName}
                  onChange={(e) => setEditLookupTeamName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  수정용 비밀번호
                </label>
                <input
                  type="password"
                  value={editLookupPassword}
                  onChange={(e) => setEditLookupPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  required
                />
              </div>
              {editError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  disabled={editLoading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-60"
                  disabled={editLoading}
                >
                  {editLoading ? "불러오는 중..." : "불러오기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

