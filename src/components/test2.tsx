


  <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                   {formatMessage({ id: "schoolManagement.dashboard" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/admin/school')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.schoolManagement" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                  <span className="text-green-400 transition-colors">
                  {formatMessage({ id: "students.navigation.students" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                </button>

            

                <button className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    <button
                      onClick={() => navigate('/admin/attendance')}
                      className="text-gray-300 group-hover:text-white transition-colors"
                    >
                     {formatMessage({ id: "students.navigation.attendance" })}
                    </button>
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
                </button>
                   <button
                  onClick={() => navigate('/admin/reports')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.reports" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                {/* <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </button>

               
                <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                </button> */}

                {/* Language Selector */}
                {/* <select
                  value={locale,}
                  onChange={handleLanguageChange}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-white/20 transition-all duration-300"
                >
                  <option value="en" className="text-gray-900">🇺🇸 {t('home.english')}</option>
                  <option value="fr" className="text-gray-900">🇫🇷 {t('home.french')}</option>
                </select> */}

                {/* <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{formatMessage({ id: "students.navigation.logout" })}</span>
                </button> */}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <nav className="pb-4 border-t border-white/10 pt-4 space-y-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
               {formatMessage({ id: "schoolManagement.dashboard" })}
              </button>
              <button
                onClick={() => navigate('/admin/school')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
               {formatMessage({ id: "schoolManagement.schoolManagement" })}
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white/10 text-green-400">
                {formatMessage({ id: "students.navigation.students" })}
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
                >
                  {formatMessage({ id: "students.navigation.dashboard" })}
                </button>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white">
                <button
                  onClick={() => navigate('/admin/attendance')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
                >
                 {formatMessage({ id: "students.navigation.attendance" })}
                </button>
              </button>
                 <button
                  onClick={() => navigate('/admin/reports')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.reports" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>


              <div className="pt-4 border-t border-white/10">
                {/* <select
                  value={locale,}
                  onChange={handleLanguageChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                >
                  <option value="en" className="text-gray-900">🇺🇸 {t('home.english')}</option>
                  <option value="fr" className="text-gray-900">🇫🇷 {t('home.french')}</option>
                </select>

                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button> */}
              </div>
            </nav>
          </div>
        </div>
      </header>




      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                <span className="text-green-400 transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Students</span>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
              </button>
              
              <button 
                onClick={() => navigate('/teacher/attendance')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Attendance</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button 
                onClick={() => navigate('/teacher/reports')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button 
                onClick={() => navigate('/docs')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Docs</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button 
                onClick={() => navigate('/teacher/profile')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <div className="flex items-center space-x-4">
             
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>